<?php

class ipRedirectionClass {

    const CITIES = [
        'izhevsk',
        'ufa',
        'perm',
        'naberezhnyyechelny',
        'tyumen',
        'tver',
        'yaroslavl',
        'vladivostok',
        'khabarovsk',
        'novosibirsk',
        'nizhniynovgorod',
        'nizhnevartovsk',
        'khantymansiysk',
        'sevastopol',
        'sochi',
    ];

    const CITIES_CYRILLIC = [
        'izhevsk' => 'ижевск',
        'ufa' => 'уфа',
        'perm' => 'пермь',
        'naberezhnyyechelny' => 'набережныечелны',
        'tyumen' => 'тюмень',
        'tver' => 'тверь',
        'yaroslavl' => 'ярославль',
        'vladivostok' => 'владивосток',
        'khabarovsk' => 'хабаровск',
        'novosibirsk' => 'новосибирск',
        'nizhniynovgorod' => 'нижнийновгород',
        'nizhnevartovsk' => 'нижневартовск',
        'khantymansiysk' => 'хантымансийск',
        'sevastopol' => 'севастополь',
        'sochi' => 'сочи',
    ];

    const CITIES_COORDINATES = [
        'izhevsk' => [56.866890, 53.208130],
        'ufa' => [54.725304, 55.948575],
        'perm' => [58.011999, 56.246960],
        'naberezhnyyechelny' => [55.741040, 52.400100],
        'tyumen' => [57.152565, 65.541750],
        'tver' => [56.820724, 35.906677],
        'yaroslavl' => [57.625699, 39.905435],
        'vladivostok' => [43.082129, 131.894671],
        'khabarovsk' => [48.477655, 135.034896],
        'novosibirsk' => [54.998415, 82.923485],
        'nizhniynovgorod' => [56.328454, 43.985188],
        'nizhnevartovsk' => [60.926695, 76.555216],
        'khantymansiysk' => [61.001348, 69.013674],
        'sevastopol' => [44.553683, 33.532655],
        'sochi' => [43.558899, 39.754977],
    ];

    const EARTH_RADIUS = 6371000;

    private static function getRemoteData(string $ip)
    {
        return @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));
    }

    private static function goToDefaultUrl(): void
    {
        header('Location: https://ижевск.талан.рф');
    }

    private static function goToNearestCity(StdClass $cityData): void
    {
        $city = self::getNearestCity($cityData->geoplugin_latitude, $cityData->geoplugin_longitude);

        header('Location: https://' . self::CITIES_CYRILLIC[$city] . '.талан.рф');
    }

    private static function getNearestCity(string $lat, string $lng): string
    {
        $distances = [];

        foreach (self::CITIES_COORDINATES as $key => $coordinates) {
            /**
             * @var $coordinates float[]
             */
            $distances[$key] = self::calculateDistance($coordinates[0], $coordinates[1], $lat, $lng);
        }

        return array_keys($distances, min($distances))[0];
    }

    private static function calculateDistance(float $lat_1, float $lng_1, float $lat_2, float $lng_2): int
    {
        $latFrom = deg2rad($lat_1);
        $lonFrom = deg2rad($lng_1);
        $latTo = deg2rad($lat_2);
        $lonTo = deg2rad($lng_2);

        $lonDelta = $lonTo - $lonFrom;
        $a = pow(cos($latTo) * sin($lonDelta), 2) +
            pow(cos($latFrom) * sin($latTo) - sin($latFrom) * cos($latTo) * cos($lonDelta), 2);
        $b = sin($latFrom) * sin($latTo) + cos($latFrom) * cos($latTo) * cos($lonDelta);

        $angle = atan2(sqrt($a), $b);

        return round($angle * self::EARTH_RADIUS, 0);
    }

    private static function goToCity(string $city): void
    {
        header('Location: https://' . $city . '.талан.рф');
    }

    private static function defineIpAddress(): string
    {
        $client  = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote  = @$_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        } else if (filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        } else  {
            $ip = $remote;
        }

        return $ip;
    }

    /**
     * @param false $getCurrentCity only return current city
     * @return string
     */
    public static function goToUserCity($getCurrentCity = false)
    {
        $ip = self::defineIpAddress();

        $ip_data = self::getRemoteData($ip);

        if ($ip_data === null) {
            self::goToDefaultUrl();
        }

        if($ip_data && $ip_data->geoplugin_countryName != null)
        {
            $city =  $ip_data->geoplugin_city;
            $city = strtolower($city);

            if ($getCurrentCity) {
                return $city;
            }

            if (in_array($city, self::CITIES)) {
                self::goToCity(self::CITIES_CYRILLIC[$city]);
            } else {
                self::goToNearestCity($ip_data);
            }
        } else {
            self::goToDefaultUrl();
        }
    }
}
