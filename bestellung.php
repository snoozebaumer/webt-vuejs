<DOCTYPE !html>
    <html>

    <head>
        <title>Bestellungsbestätigung</title>
        <meta charset="utf8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    </head>

    <body>
        <?php
        if (checkExpectedParams()) {
            $date = $_POST["date"];
            $number = $_POST["number"];
            $product = $_POST["product"];
            $address = $_POST["address"];
            $formattedDate = date("d.m.Y", strtotime($date));
            echo "<main class='w3-content'>";
            echo "<h2>Vielen Dank für Ihre Bestellung</h2>";
            echo "<p> Sie bestellten auf den " . $formattedDate . " " . $number . " x \"" . $product;
            echo "\" an die Adresse: " . $address . "</p>";


            $numberOfPurchases = 0;

            if (!isset($_COOKIE["numberOfPurchases"])) {
                $numberOfPurchases = 1;
            } else {
                $numberOfPurchases = $_COOKIE["numberOfPurchases"];
            }

            echo "<p>Dies ist Ihre " . $numberOfPurchases . ". Bestellung bei uns. Herzlichen Dank!</p>";

            echo "<a href=\"index.html?site=Form&success=true\">Zurück zum Shop</a>";

            $mailMessage = "Es wurden auf den " . $formattedDate . " " . $number . " x " . $product . " bestellt" .
                "\nEmpfänger-Adresse: " . $address;


            mail(
                "webshopowner@example.com",
                "Neue Bestellung: " . $product,
                $mailMessage,
                'From: Unnecessary Sales Shop <uss@example.com>'
            );
            $numberOfPurchases++;
            setcookie("numberOfPurchases", $numberOfPurchases);
        } else {
            echo "<a href=\"index.html?site=Form\">Zurück zum Shop</a>";
        }
        echo "</main>";

        function checkExpectedParams()
        {
            if (!isset($_POST["date"])) {
                echo getParamMissingError("Bestelldatum");
                return false;
            }

            if (!isset($_POST["product"])) {
                echo getParamMissingError("Bestelltes Produkt");
                return false;
            }

            if (!isset($_POST["number"])) {
                echo getParamMissingError("Anzahl Produkte");
                return false;
            }

            if (!isset($_POST["address"])) {
                echo getParamMissingError("Adresse");
                return false;
            }


            $validDate = checkValidDate();
            $validNumber = checkValidNumber();
            $validProduct = checkValidProduct();
            $addressLengthAppropriate = checkAddressLength();

            return $validDate && $validNumber && $validProduct && $addressLengthAppropriate;
        }

        function checkValidDate()
        {
            try {
                date_default_timezone_set("Europe/Zurich");
                $date = new DateTime($_POST["date"]);
                $currentDate = new DateTime();

                if ($date <= $currentDate) {
                    echo "<p>Bitte geben Sie ein Datum in der Zukunft ein.</p>";
                    return false;
                }
                return true;
            } catch (Exception $e) {
                echo "<p>Bitte geben Sie ein valides Datum ein</p>";
                return false;
            }
        }

        function checkValidNumber()
        {
            $number = intval($_POST["number"]); //strings will likely return 0 so no exception thrown
            if ($number < 1 || $number > 100) {
                echo "<p>Bitte bestellen Sie eine Anzahl von 1 bis 100 Produkten.</p>";
                return false;
            }
            return true;
        }

        function checkValidProduct()
        {
            $product = $_POST["product"];

            //as in frontend, this would be stored in db in practice, but i've already integrated Vue
            $validProducts = ['Ei', 'Ei Zwei', 'Apfel "Gala"', 'Apfel "Gala" - Vegan', 'Apfel "Gala" vom letzten Herbst'];

            if (!in_array($product, $validProducts)) {
                echo "Bitte geben Sie in der Bestellung ein existierendes Produkt an.";
                return false;
            }

            return true;
        }

        function checkAddressLength()
        {
            $address = $_POST["address"];
            $length = strlen($address);
            if ($length < 5 || $length > 1000) {
                echo "Bitte geben Sie eine Adresse mit 5 bis 1000 Zeichen an.";
                return false;
            }
            return true;
        }

        function getParamMissingError(String $name)
        {
            return "<p>" . $name . " wird benötigt. Bitte füllen Sie das Bestellformular korrekt aus.</p>";
        }
        ?>
    </body>

    </html>