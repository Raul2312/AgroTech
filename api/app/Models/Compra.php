<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $table = 'compras';
    
    // Indicamos que la llave primaria es el ID de PayPal
    protected $primaryKey = 'id_transaccion'; 

    // Desactivamos el incremento automático porque es un string
    public $incrementing = false; 
    protected $keyType = 'string'; 

    protected $fillable = [
        'id_transaccion',
        'id_producto',
        'id_comprador',
        'id_vendedor',
        'total',
        'iva'
    ];

    public function producto() {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}