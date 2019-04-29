<?php
/* CONFIGURACIÓN */
require 'config_db.php';

/* FUNCIONES */
require 'functions.php';


$conn = connect_db($db);
$sql= 'SELECT * FROM usuario WHERE usuario = "ivonne"';
$usuario	= make_query($conn,$sql);

?>

<form method="post" action="">
	<label>eviar</label><input name="enviar" type="submit"/>
</form>



<?php
   // echo $usuario[0]['token'];
	if(!empty($_POST['enviar'])){
        $url = 'https://fcm.googleapis.com/fcm/send';
        $fields = array (
            'to' => $usuario[0]['token'],//Replace with FIRInstanceID.instanceID().token() this you can get in Appdelegate, note this is NOT token received in didRegisterForRemoteNotificationsWithDeviceToken
            'notification' => array (
                "body" => "gran sjjsjs",
                "title" => "tituloosososo",
                "icon" => "myicon"
            )
        );
        $fields = json_encode ( $fields );
        $headers = array (
            'Authorization: key=' . "AIzaSyB3rOcEPvlyzVikLvhTV1gcxuqoJDHtTz4",//This is Server Key, you can get it from Firebase console ->  App Setting ->  Cloud Messaging Tab - Legacy server key
            'Content-Type: application/json'
        );

        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, true );
        curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );

        $result = curl_exec ( $ch );
        $resultado = json_decode($result);

        if($resultado->success == 1){
                echo "Mensaje enviado";
        }
        curl_close ( $ch );


    }


/*
require_once 'php-jwt/src/BeforeValidException.php';
require_once 'php-jwt/src/ExpiredException.php';
require_once 'php-jwt/src/SignatureInvalidException.php';
require_once 'php-jwt/src/JWT.php';
use Firebase\JWT\JWT;
$service_account_email = "firebase-adminsdk-qf2sb@connecting-e5377.iam.gserviceaccount.com";
$private_key = "AAAA3hVyEcg:APA91bEVGE9VdmXFVGl2FIKyZpOqe9p8Gku2zJ2BO2dgDZVR_Q-UI7nu7sqF-pVRhcsUpMO6DLIzzCdl5q9EDFfZl94yVtmSS6VEkd1C7JU2pRwXEVKovN_QL9DhWzRpXoFFNjPsFyta";

$now_seconds = time();
$payload = array(
    "iss" => $service_account_email,
    "sub" => $service_account_email,
    "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    "iat" => $now_seconds,
    "exp" => $now_seconds+(60*60),  // Maximum expiration time is one hour
    "uid" => 'ivonne@prismacm.com',

);
echo JWT::encode($payload, $private_key, "HS256");
*/
    ?>