<?php
/**
 * jBackend push plugin for Joomla
 *
 * @author selfget.com (info@selfget.com)
 * @package jBackend
 * @copyright Copyright 2014 - 2016
 * @license GNU Public License
 * @link http://www.selfget.com
 * @version 3.1.0
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

class plgJBackendPush extends JPlugin
{
  /**
  *
  * @var array
  * @access  private
  */
  private $_platforms = array(0 => 'generic', 1 => 'android', 2 => 'ios');

  /**
  *
  * @var array
  * @access  private
  */
  private $_gcm_url = '';

  /**
  *
  * @var array
  * @access  private
  */
  private $_api_key = '';

  /**
  *
  * @var array
  * @access  private
  */
  private $_apns_url = '';

  /**
  *
  * @var array
  * @access  private
  */
  private $_timeout = '';

  public function __construct(& $subject, $config)
  {
    parent::__construct($subject, $config);
    $this->loadLanguage();
  }

  public static function generateError($errorCode)
  {
    $error = array();
    $error['status'] = 'ko';
    switch($errorCode) {
      case 'REQ_ANS':
        $error['error_code'] = 'REQ_ANS';
        $error['error_description'] = 'Action not specified';
        break;
      case 'PSH_TNS':
        $error['error_code'] = 'PSH_TNS';
        $error['error_description'] = 'Token not specified';
        break;
      case 'PSH_ANS':
        $error['error_code'] = 'PSH_ANS';
        $error['error_description'] = 'App code not specified';
        break;
      case 'PSH_PNS':
        $error['error_code'] = 'PSH_PNS';
        $error['error_description'] = 'Platform not specified';
        break;
      case 'PSH_PUN':
        $error['error_code'] = 'PSH_PUN';
        $error['error_description'] = 'Platform unknown';
        break;
      case 'PSH_ESA':
        $error['error_code'] = 'PSH_ESA';
        $error['error_description'] = 'Error saving app code';
        break;
      case 'PSH_AUN':
        $error['error_code'] = 'PSH_AUN';
        $error['error_description'] = 'Application unknown';
        break;
      case 'PSH_ESD':
        $error['error_code'] = 'PSH_ESD';
        $error['error_description'] = 'Error saving device';
        break;
    }
    return $error;
  }

  public function checkPushOnDevice($notification, $device)
  {
    // @todo add context check
    return true;
  }

  public function push_generic($notification, $device)
  {
    // @todo add support for generic notifications (e.g. mail)
    return false;
  }

  public function push_android($notification, $device)
  {
    $success = false;

    $api_key = (strlen($notification['api_key']) > 0) ? $notification['api_key'] : $this->_api_key;

    $headers = array('Authorization: key=' . $api_key, 'Content-Type: application/json');

    $registration_ids = array($device['token']);

    // @todo add support for other fields in the payload
    $payload = array(
      'title'      => $notification['title'],
      'message'    => $notification['message'],
      'icon'       => 'icon',
      'data'       => $notification['payload']
    );

    $fields = array('registration_ids' => $registration_ids, 'data' => $payload);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $this->_gcm_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
    curl_close($ch);

    if ($result)
    {
      $response = json_decode($result);
      if ($response->success > 0) $success = true;
    }

    return $success;
  }

  public function push_ios($notification, $device)
  {
    $success = false;

    $ctx = stream_context_create();
    stream_context_set_option($ctx, 'ssl', 'local_cert', jBackendHelper::getCertificatePath($notification['ssl_certificate']));
    stream_context_set_option($ctx, 'ssl', 'passphrase', $notification['pwd_certificate']);

    $fp = stream_socket_client($this->_apns_url, $err, $errstr, $this->_timeout, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

    if ($fp)
    {
      // @todo add support for other fields in the payload
      $body = array(
          'aps' => array(
              'alert' => array(
                  'title' => $notification['title'],
                  'body' => $notification['message']
              ),
              'sound' => 'default'
          ),
          'data' => $notification['payload']
      );
      $payload = json_encode($body);
      $msg = chr(0) . pack('n', 32) . pack('H*', $device['token']) . pack('n', strlen($payload)) . $payload;
      $success = fwrite($fp, $msg, strlen($msg));
      fclose($fp);
    }

    return $success;
  }

  public function actionRegister(&$response, &$status = null)
  {
    $app = JFactory::getApplication();

    $json_data = null;
    $json_register = $this->params->get('json_register', '1');
    if ($json_register)
    {
      // Get the input data as JSON
      $json = new JInputJSON;
      $json_data = json_decode($json->getRaw(), true);
    }

    // Get device registration token
    $token = (isset($json_data)) ? $json_data['token'] : $app->input->getString('token');
    if (is_null($token))
    {
        $response = self::generateError('PSH_TNS'); // Token not specified
        return false;
    }

    // Get application code
    $appcode = (isset($json_data)) ? $json_data['appcode'] : $app->input->getString('appcode');
    if (is_null($appcode))
    {
        $response = self::generateError('PSH_ANS'); // App code not specified
        return false;
    }
    $appcode = strtolower($appcode);

    // Get platform
    $platform = (isset($json_data)) ? $json_data['platform'] : $app->input->getString('platform');
    if (is_null($platform))
    {
        $response = self::generateError('PSH_PNS'); // Platform not specified
        return false;
    }

    $platform = strtolower($platform);
    $platform_code = array_search($platform, $this->_platforms);
    if ($platform_code === false)
    {
        $response = self::generateError('PSH_PUN'); // Platform unknown
        return false;
    }

    // Get app id
    $app_id = 0;
    $db = JFactory::getDbo();

    $auto_appcode = $this->params->get('auto_appcode', false);
    if ($auto_appcode)
    {
        $db->setQuery("INSERT IGNORE INTO `#__jbackend_apps` (`code`) VALUES (" . $db->quote($appcode) . ")");
        $res = @$db->query();
        if (!$res)
        {
            $response = self::generateError('PSH_ESA'); // Error saving app code
            return false;
        }
        $app_id = $db->insertid();
    }

    if ($app_id == 0)
    {
        $db->setQuery("SELECT `id` FROM `#__jbackend_apps` WHERE `code` = " . $db->quote($appcode));
        $app_id = $db->loadResult();

        if ($app_id == 0)
        {
            $response = self::generateError('PSH_AUN'); // Application unknown
            return false;
        }
    }

    // Get other device options
    $ios_alert = (isset($json_data)) ? $json_data['ios_alert'] : $app->input->getString('ios_alert');
    $ios_alert = strtolower($ios_alert);
    $ios_alert= (($ios_alert === '1') || ($ios_alert === 'true')) ? $ios_alert = 1 : $ios_alert = 0;

    $ios_badge = (isset($json_data)) ? $json_data['ios_badge'] : $app->input->getString('ios_badge');
    $ios_badge = strtolower($ios_badge);
    $ios_badge= (($ios_badge === '1') || ($ios_badge === 'true')) ? $ios_badge = 1 : $ios_badge = 0;

    $ios_sound = (isset($json_data)) ? $json_data['ios_sound'] : $app->input->getString('ios_sound');
    $ios_sound = strtolower($ios_sound);
    $ios_sound= (($ios_sound === '1') || ($ios_sound === 'true')) ? $ios_sound = 1 : $ios_sound = 0;

    // Register device
    $last_request = date("Y-m-d H:i:s");
    $db->setQuery("INSERT INTO `#__jbackend_devices` (`token`, `app_id`, `platform`, `ios_alert`, `ios_badge`, `ios_sound`, `hits`, `last_request`) VALUES (" . $db->quote($token) . ", " . $db->quote($app_id) . ", " . $db->quote($platform_code) . ", " . $db->quote($ios_alert) . ", " . $db->quote($ios_badge) . ", " . $db->quote($ios_sound) . ", " . $db->quote("1") . ", " . $db->quote($last_request) . ") ON DUPLICATE KEY UPDATE `app_id` = " . $db->quote($app_id) . ", `platform` = " . $db->quote($platform_code) . ", `ios_alert` = " . $db->quote($ios_alert) . ", `ios_badge` = " . $db->quote($ios_badge) . ", `ios_sound` = " . $db->quote($ios_sound) . ", `hits` = `hits` + 1, `last_request` = " . $db->quote($last_request));
    $res = @$db->query();
    if (!$res)
    {
        $response = self::generateError('PSH_ESD'); // Error saving device
        return false;
    }
    $device_id = $db->insertid();

    $response['status'] = 'ok';
    $response['token'] = $token;
    $response['appcode'] = $appcode;
    $response['platform'] = $platform;
    $response['platform_code'] = $platform_code;
    $response['app_id'] = $app_id;
    $response['device_id'] = $device_id;
    $response['ios_alert'] = $ios_alert;
    $response['ios_badge'] = $ios_badge;
    $response['ios_sound'] = $ios_sound;
    return true;
  }

  public function actionScheduler(&$response, &$status = null)
  {
    // Load platform parameters
    $this->_gcm_url = $this->params->get('gcm_url', '');
    $this->_api_key = $this->params->get('api_key', '');
    $this->_apns_url = $this->params->get('apns_url', '');
    $this->_timeout = $this->params->get('timeout', '');

    // Get batch size
    $batch_size = $this->params->get('batch_size', 10);
    $sent = 0;
    $success = 0;
    $failure = 0;

    // Get notifications to send
    $db = JFactory::getDbo();
    $nullDate = $db->getNullDate();
    $query = $db->getQuery(true);
    $query->select('n.*, na.api_key as api_key, na.ssl_certificate as ssl_certificate, na.pwd_certificate as pwd_certificate')
          ->from('#__jbackend_notifications AS n')
          ->join('LEFT', $db->quoteName('#__jbackend_apps') . ' na ON na.id=n.app_id')
          ->where('(`scheduled_time` <= NOW()) AND (`status` IN (0, 1)) AND (`locked_out` = 0)')
          ->order('`scheduled_time` ASC');
    $db->setQuery($query);
    $notifications = $db->loadAssocList();

    // Process notifications
    foreach ($notifications as $nk => $notification)
    {
      // Set the platform push function of the current notification
      $sender = 'push_' . $this->_platforms[$notification['platform']];

      // Lock current notification and set status to running
      $now = JFactory::getDate();
      $db->setQuery("UPDATE `#__jbackend_notifications` SET `status` = 1, `locked_out` = 1, `locked_out_time` = " . $db->quote($now) . " WHERE `id` = " . $db->quote($notification['id']));
      $res = @$db->query();

      // Scan registered devices starting from the first next after the last device id
      $scan_devices = true;
      $notification_status = 1;
      $last_device_id = $notification['last_device_id'];
      while ($scan_devices)
      {
        // Get a pool of devices
        $query = $db->getQuery(true);
        $query->select('*')
              ->from('#__jbackend_devices AS d')
              ->where('(`id` > ' . $db->quote($last_device_id) . ') AND (`app_id` = ' . $db->quote($notification['app_id']) . ') AND (`platform` = ' . $db->quote($notification['platform']) . ')')
              ->order('`id` ASC')
              ->setLimit($batch_size);
        $db->setQuery($query);
        $devices = $db->loadAssocList();

        // Check if completed all devices for current notification
        if (count($devices) == 0)
        {
          $notification_status = 2; // Completed
          break;
        }

        // Scan the current pool of devices
        foreach ($devices as $dk => $device)
        {
          $last_device_id = $device['id'];

          // Check device
          if ($this->checkPushOnDevice($notification, $device))
          {
            // Send notification to device
            if ($this->$sender($notification, $device)) { $success++; } else { $failure++; }

            // Update device statistics
            $now = JFactory::getDate();
            $db->setQuery("UPDATE `#__jbackend_devices` SET `push_hits` = `push_hits` + 1, `last_push` = " . $db->quote($now) . " WHERE `id` = " . $db->quote($device['id']));
            $res = @$db->query();

            // Update counter
            $sent++;
            if ($sent >= $batch_size)
            {
              $scan_devices = false;
              break;
            }

          }
        }
      }

      // Unlock current notification and update status and statistics
      $now = JFactory::getDate();
      $db->setQuery("UPDATE `#__jbackend_notifications` SET `status` = " . $db->quote($notification_status) . ", `last_run` = " . $db->quote($now) . ", `last_device_id` = " . $db->quote($last_device_id) . ", `locked_out` = 0, `locked_out_time` = " . $db->quote($nullDate) . " WHERE `id` = " . $db->quote($notification['id']));
      $res = @$db->query();

      if ($sent >= $batch_size) break;
    }

    $response['status'] = 'ok';
    $response['batch_size'] = $batch_size;
    $response['sent'] = $sent;
    $response['success'] = $success;
    $response['failure'] = $failure;
    return true;
  }

  public function actionStats(&$response, &$status = null)
  {
    $app = JFactory::getApplication();

    // @todo add statistical analysis function
    $response['status'] = 'ok';
    $response['stats'] = 'yes';
    return true;
  }

  /**
   * Fulfills requests for push module
   *
   * @param   object    $module      The module invoked
   * @param   object    $response    The response generated
   * @param   object    $status      The boundary conditions (e.g. authentication status)
   *
   * @return  boolean   true if there are no problems (status = ok), false in case of errors (status = ko)
   */
  public function onRequestPush($module, &$response, &$status = null)
  {
    if ($module !== 'push') return true;

    // Add to module call stack
    jBackendHelper::moduleStack($status, 'push');

    $app = JFactory::getApplication();
    $action = $app->input->getString('action');

    if (is_null($action)) {
      $response = self::generateError('REQ_ANS'); // Action not specified
      return false;
    }

    $resource = $app->input->getString('resource');

    switch ($resource)
    {
      case 'register':
        if ($action == 'put')
        {
          return $this->actionRegister($response, $status);
        }
        break;
      case 'scheduler':
        if ($action == 'get')
        {
          return $this->actionScheduler($response, $status);
        }
        break;
      case 'stats':
        if ($action == 'get')
        {
          return $this->actionStats($response, $status);
        }
        break;
    }

    return true;
  }
}
