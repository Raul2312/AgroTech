<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PayPallController extends Controller
{
    public function index($amount)
    {
        $client_id = env('PAYPAL_CLIENT_ID');
        return view('paypal', compact('amount', 'client_id'));
    }
}