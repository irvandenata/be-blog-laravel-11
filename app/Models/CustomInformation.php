<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomInformation extends Model
{
    use HasFactory;
    protected $table = 'custom_informations';
    protected $guarded = [];
}
