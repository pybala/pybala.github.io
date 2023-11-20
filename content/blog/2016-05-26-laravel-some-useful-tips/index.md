---
title: "Laravel - some useful tips"
date: "2016-05-26"
canonical: "https://balakumar.net.in/laravel-some-useful-tips/"
categories: 
  - "web"
tags: 
  - "laravel"
  - "php"
---

## php artisan migrate not working

Added new migrations and running _**php artisan migrate**_ not working, then try running the following artisan command. Also this works for any env related config changes.

```shell
php artisan config:cache
php artisan migrate
```

Still not working, then try composer auto load.

```shell
php artisan cache:clear
composer dump-autoload
php artisan migrate
```

## Fixing unknown column 'updated_at' in 'field list'.

This happens because Laravel assumes that you want to use the **updated_at** and **created_at** timestamps for your models. So it also assumes that they exist in the database. You can either create the two columns or disable timestamps for your model by adding

```php
public $timestamps = false;
```

## Getting the request input in Laravel views

```php
app('request')->input('submit')
```

## Listing all the Sessions in Laravel

```php
Session::get(null)
```

## Added new views and getting views not found error, then try running the following artisan command.

```shell
php artisan config:cache
```

## Clearing all the caches

```shell
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan route:clear
php artisan optimize --force
composer dumpautoload -o
```
