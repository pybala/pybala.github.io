---
title: "Useful APIs while developing in Concrete5"
date: "2012-04-25"
canonical: "https://balakumar.net.in/useful-apis-while-developing-in-concrete5/"
categories: 
  - "web"
  - "cms"
tags: 
  - "php"
  - "concrete5"
---

#### User

_Adding a new User in Concrete5_

```php
$data = array('uName' => 'test', 'uPassword' => 'xxxxx', 'uEmail' => 'test@test.com');
$userObj = UserInfo::add($data);
$user_id = $userObj->getUserID(); // returns the newly inserted user details
```

_Getting User info by username, id, email in Concrete5_

```php
$user = UserInfo::getByUserName('test');
$user = UserInfo::getByEmail('email id');
$user = User::getByUserID($uID);
```

_Getting user information from user object_

```php
$user->getUserName();
$user->uGroups;
```

_Getting the current logged in user info_

```php
$curUser = new User();
```

_Adding a User to a Group_

```php
$user->enterGroup($groupObj);
```

_Logging in with user id in Concrete5_

```php
User::loginByUserID($uID);
```

_Logging out from Concrete5_

```php
$user = new User();
$user->logout();
```

#### Group

_Adding a new group_

```php
Group::add('name', 'description');
```

_Getting group info using id and name_

```php
$group = Group::getByName($gname);
$group = Group::getByID($gID);
$group_id = $group->getGroupID();
$group_name = $group->getGroupName();
$group_desc = $group->getGroupDescription();
```


#### Page

_Creating a new Page_

```php
$parent = Page::getByID(1); // Home page
$ct = CollectionType::getByHandle('page');
$data = array('cName'=>'My Page', 'cDescription'=>'My Page Description', 'cHandle'=>'my-page');
$p = $parent->add($ct, $data);
```

_Deleting a Page_

```php
$page = Page::getByID($pageID);
or
$page = Page::getByHandle('my-page');
$page->delete();
```

#### Installing Block and Theme

_Installing a custom block_

```php
BlockType::installBlockType('custom_block');
```

_Adding and removing theme_

```php
$theme = PageTheme::add('custom_theme');
$theme = PageTheme::getByHandle('custom_theme');
$theme->uninstall();
```

#### Single Page

_Registering a Single Page_

```php
$singlePage = SinglePage::add('mypage');
```

_Adding attributes to a Page_

```php
$singlePage->setAttribute('exclude_nav', 1);
```
