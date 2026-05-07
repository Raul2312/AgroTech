<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <script src="https://www.paypal.com/sdk/js?client-id={{$client_id}}&currency=MXN"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: transparent;
            box-sizing: border-box;
        }

        #paypal-button-container {
            width: 100%;
            max-width: 400px;
        }
    </style>
</head>

<body>
    <div id="paypal-button-container"></div>
    <script>
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: {{$amount}}
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    // Send message back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        status: 'success',
                        details: details
                    }));
                });
            },
            onError: function (err) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'error',
                    error: err.toString()
                }));
            },
            onCancel: function (data) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    status: 'cancel'
                }));
            }
        }).render('#paypal-button-container');
    </script>
</body>

</html>