---
title: "How to use token in Ajax in Concrete5"
date: "2012-05-22"
canonical: "https://balakumar.net.in/how-to-use-token-in-ajax-in-concrete5/"
categories: 
  - "WEB"
  - "CMS"
tags: 
  - "PHP"
  - "Concrete5"
---

_**Client side**_

```html
$token = Loader::helper('validation/token');
<form id="employee_form">
    <input type="text" name="emp_name" id="emp_name" value="" />
    <input type="button" id="emp_action" value="Submit" />
    <? $token->output('employee_ajax'); ?>
</form>

<script type="text/javascript">
$('#emp_action').click(function() {
    var args = {
        emp_name: $('#emp_name').val(),
        ccm_token: $('#employee_form').find('input[name="ccm_token"]').val()
    };
});
</script>
```

_**Server Side**_

```php
$vForm = Loader::helper('validation/form');

if ( isset($_POST['emp_name']) ) {
    $vForm->addRequiredToken('employee_ajax');
    if (!$vForm->test()) {
        die("Access Denied.");
    }

    /* Do further actions, if the token is valid */
}
```
