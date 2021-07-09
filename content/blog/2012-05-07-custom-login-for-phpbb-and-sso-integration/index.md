---
title: "Custom login for phpBB and SSO integration"
date: "2012-05-07"
categories: 
  - "php"
tags: 
  - "login"
  - "php"
  - "phpbb"
  - "plugin"
---

PhpBB has the concept of adding custom authentication plugin.

**How to add**

_Assuming the custom authentication plugin name is mylogin_

1. Get into includes/auth/ dir
2. Add a new file called auth_mylogin.php
3. Paste the below code into auth_mylogin.php file

```php
function init_mylogin() {}

function login_mylogin(&$username, &$password) {
    global $db, $user, $auth;

    $ssoSess = new SloginSession();
    $ssoUser = $ssoSess->currentUserInfo();

    if ( is_object($ssoUser) ) {

        if ($user->data['username'] != 'Anonymous') {
            if ($user->data['username'] != $ssoUser->uname) {
                $user->session_kill();
                $user->session_begin();
                $auth->acl($user->data);
            }
        }

        $sql = 'SELECT user_id, username, user_password, user_passchg, user_email, user_type
          FROM ' . USERS_TABLE . "
          WHERE username = '" . $db->sql_escape($ssoUser->uname) . "'";

        $result = $db->sql_query($sql);
        $user_row = $db->sql_fetchrow($result);
        $db->sql_freeresult($result);

        if ($user_row) {
            // User inactive...
            if ($user_row['user_type'] == USER_INACTIVE || $user_row['user_type'] == USER_IGNORE) {
                return array(
                  'status'		=> LOGIN_ERROR_ACTIVE,
                  'error_msg'		=> 'ACTIVE_ERROR',
                  'user_row'		=> $user_row,
                );
            }
        } else {
            //echo 'else - new user from SSO';
            $user_id = addUser($ssoUser);
        }

        if (isset($user_row['user_id'])) {
            $user_id = $user_row['user_id'];
        }

        $sql = "SELECT group_id FROM ". GROUPS_TABLE . "
                WHERE group_name = '" . $db->sql_escape('REGISTERED') . "'
                AND group_type = '" . GROUP_SPECIAL."'";

        $group_result = $db->sql_query($sql);
        $group_row = $db->sql_fetchrow($group_result);
        $db->sql_freeresult($group_result);

        /* Check for User added to group or not */
        $sql = "SELECT group_id FROM ".USER_GROUP_TABLE."
            WHERE user_id = " . $user_id . " AND group_id =".$group_row['group_id']."";             

        $result = $db->sql_query($sql);
        $row = $db->sql_fetchrow($result);

        if (!isset($row['group_id'])) {
              $sql = 'INSERT INTO ' . USER_GROUP_TABLE . ' ' . $db->sql_build_array('INSERT', array(
                  'user_id'		=> (int) $user_id,
                  'group_id'		=> (int) $group_row['group_id'],
                  'user_pending'	=> 0)
              );
              $db->sql_query($sql);
        }

        // Successful login...
        return array(
            'status'		=> LOGIN_SUCCESS,
            'error_msg'		=> false,
            'user_row'		=> $user_row,
        );
    } else {
        if ($user->data['username'] != 'Anonymous') {
            $user->session_kill();
            $user->session_begin();
        }
    }

    return false;
}

function autologin_mylogin() {
    global $db;

    $ssoSess = new SloginSession();
    $ssoUser = $ssoSess->currentUserInfo();

    if ( is_object($ssoUser) ) {

        $sql = "SELECT * FROM " . USERS_TABLE . " WHERE username = '" . $ssoUser->uname . "'";
        $result = $db->sql_query($sql);
        $row = $db->sql_fetchrow($result);
        $db->sql_freeresult($result);

        if ($row) {
            return $row;
        }
    }

    return array();
}

/**
* The session validation function checks whether the user is still logged in
*
* @return boolean true if the given user is authenticated or false if the session should be closed
*/
function validate_session_mylogin(&$user) {
    $ssoSess = new SloginSession();
    $ssoUser = $ssoSess->currentUserInfo();

    if ( is_object($ssoUser) ) {
        if ($user['username'] == $ssoUser->uname) {
            return true;
        }
    }

    return false;
}

function addUser($userInfo) {
    global $db;

    // first retrieve default group id
    $sql = "SELECT group_id FROM " . GROUPS_TABLE . "
          WHERE group_name = '" . $db->sql_escape('REGISTERED') . "'
          AND group_type = " . GROUP_SPECIAL."";
    $result = $db->sql_query($sql);
    $row = $db->sql_fetchrow($result);
    $db->sql_freeresult($result);

    $uInfo =  array(
        'username'		=> $userInfo->uname,
        'username_clean'		=> $userInfo->uname,
        'user_password'	=> '',
        'user_email'	=> $userInfo->email,
        'group_id'		=> (int) $row['group_id'],
        'user_type'		=> USER_NORMAL,
    );

    $userId = user_add($uInfo); // user_add is phpBB api to add new User

    return $userId;
}
?>
```

**Enabling the new authentication method**

Run the below script to make our new authentication method as the default one. By default the method is db (ie auth_db)

```php
$sql = "SELECT config_value from phpbb_config WHERE config_name='auth_method'";
$result = $db->sql_query($sql);
$row = $db->sql_fetchrow($result);
$db->sql_freeresult($result);

if ($row && $row['config_value'] != 'mylogin') {
    $sql = "UPDATE phpbb_config SET config_value='mylogin' WHERE config_name='auth_method'";
    $db->sql_query($sql);
}
```
