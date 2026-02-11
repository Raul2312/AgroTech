<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
     protected $table = 'compras';
    protected $primaryKey = 'id_transaccion';

    protected $fillable = [
        'id_producto',
        'id_comprador',
        'id_vendedor',
        'total',
        'iva'
    ];

    // Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function comprador()
    {
        return $this->belongsTo(Usuario::class, 'id_comprador');
    }

    public function vendedor()
    {
        return $this->belongsTo(Usuario::class, 'id_vendedor');
    }
}
