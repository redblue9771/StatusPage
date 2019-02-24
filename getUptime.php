<?php
    $user=$_GET["user"];
    $type=$_GET["type"];
    $id=$_GET["id"];
    function getData($curl,$url){
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/x-www-form-urlencoded"
            ),
        ));
        $res =curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if (!$err) {
            echo $res;
        }
        return $err;
    }

    switch($type)
    {
        case 0:
        $url="https://status.uptimerobot.com/api/status-page/".$user."/1?sort=1";
        $curl=curl_init();
        $err=getData($curl,$url);
        if($err){
            $url="https://stats.uptimerobot.com/api/status-page/".$user."/1?sort=1";
            $curl=curl_init();
            $err1=getData($curl,$url);
            if ($err1){
                echo json_encode(["status"=>false, "message"=>"Error fetching status."]);
                break;
            }
        }
        case 1:
        $url="https://status.uptimerobot.com/api/monitor-page/".$user."/".$id;
        $curl=curl_init();
        $err=getData($curl,$url);
        if($err){
            $url="https://stats.uptimerobot.com/api/monitor-page/".$user."/".$id;
            $curl=curl_init();
            $err1=getData($curl,$url);
            if ($err1){
                echo json_encode(["status"=>false, "message"=>"Error fetching status."]);
                break;
            }
        }
        default:
        echo json_encode(["status"=>false, "message"=>"FormData Error!"]);
    }

  //  Request URL: https://stats.uptimerobot.com/api/monitor-page/wKLkwH4ZG/782019569
?>