<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['name_doc', 'type_doc', 'img_doc', 'txt_doc', 'email'];
}
