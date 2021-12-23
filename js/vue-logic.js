/*********************************************************************************************************************
 * data & models (most of this would be serverside in a db, but the scope would be too big
 * and i wouldn't get additional points for it as i've already integrated vue)
 *********************************************************************************************************************/
let productList = [
    {
        name: "Ei",
        price: 0.25,
        image: "img/egg.jpg",
        reduction: 20,
        description: "Ei aus Freilandhaltung, Polierstatus unbekannt"
    },
    {
        name: "Ei Zwei",
        price: 1.25,
        image: "img/egg2.jpg",
        reduction: 40,
        description: "Premium-Ei aus noch freieren Landhaltung, mehrfach poliert"
    },
    {
        name: "Apfel \"Gala\"",
        price: 2.21,
        image: "img/apple.jpg",
        reduction: 10,
        description: "Mini-Apfel \"Gala\". Der Apfel im Bild ist aus Verzehrgründen nicht käuflich."
    },
    {
        name: "Apfel \"Gala\" - Vegan",
        price: 1.73,
        image: "img/apple.jpg",
        reduction: 10,
        description: "Mini-Apfel \"Gala\". Der Apfel im Bild ist aus Verzehrgründen nicht käuflich."
    },
    {
        name: "Apfel \"Gala\" vom letzten Herbst",
        price: 0.62,
        image: "img/gabriel-jimenez-jin4W1HqgL4-unsplash.jpg",
        reduction: 10,
        description: "Mini-Apfel \"Gala\". Möglicherweise nicht geniessbar."
    }
];

let formInputList = [
    {
        label: "Gewünschtes Lieferdatum",
        name: "date",
        type: "date",
        required: true
    },
    {
        label: "Produkt",
        name: "product",
        type: "select",
        required: true
    },
    {
        label: "Anzahl",
        name: "number",
        type: "number",
        required: true,
        min: 1,
        max: 100
    },
    {
        label: "Adresse",
        name: "address",
        type: "text",
        minLength: 5,
    maxLength: 1000,
        required: true
    }
];

let orderModel = {
    date: null,
    product: null,
    number: null,
    address: null
}


let obj = {
    currentPage: "Home",
    currentSale: "Ein-Tag-Vor-Woche-Vor-Oster-Sale!!",
    saleText: "Herzlich willkommen auf der Webseite, auf der immer Ausverkauf ist. Der momentane Sale bietet wieder einmal eine Vielzahl an fabulösen Produkten.\n " +
        "Warenbestellungen empfangen wir gerne über \"Formular\". " +
        "Unter \"Canvas\" haben wir noch eine Überraschung für Sie vorbereitet.\n" +
        "Den Warenkatalog finden Sie unter diesem Text.",
    formTitle: "Bestellformular",
    formDescription: "Nur solange Vorrat!",
    products: productList,
    formInputs: formInputList,
    order: orderModel,
    formErrorList: [],
    formSuccess: false,
    canvasNumber: 1,
    canvasInterval: null
}

/*********************************************************************************************************************
 * logic
 * *******************************************************************************************************************/

new Vue({
    el: "#content",
    data: obj,
    created() {
        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        //set correct site on reload
        obj.currentPage = params.get("site") || "Home";
        //show success indicator if form was sent successfully
        obj.formSuccess = params.get("success") || false;
    },
    mounted() {
        if (obj.currentPage === "Canvas") {
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext('2d');
            this.displayBackground(ctx); // draw func 1
            this.displayBorder(ctx); // 2
            this.drawMinusRectangle(ctx); // 3
            this.drawZeroEllipse(ctx); // 4
            this.drawPercentageCircle(ctx, 480, 192); // 5
            this.drawPercentageLine(ctx); // 6
            this.drawPercentageCircle(ctx,540, 255) // 7

            obj.canvasInterval = window.setInterval(this.displayNumber, 300, ctx) //8 9 10

        }
    },
    methods: {
        switchPage: function (newPage) {
            obj.currentPage = newPage;
        },
        isActive: function (name) {
            return obj.currentPage === name;
        },
        displayNumber: function (ctx) {
            if (obj.canvasNumber > 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(180, 75, 120, 240); // 8. draw func though called 9 times
            }
            ctx.font = "9em Arial"
            ctx.fillStyle = "red";
            ctx.fillText(obj.canvasNumber.toString(), 225, 264); // 9. draw func though called 9 times

            if (obj.canvasNumber === 9) {
                clearInterval(obj.canvasInterval);
                ctx.font = "3em Arial";
                ctx.fillText("Rabatt mit Code \"Bestanden\"", 225, 360); // 10. draw func
                ctx.beginPath();
                return;
            }
            obj.canvasNumber++;
        },
        displayBackground: function (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 900, 450);
        },
        displayBorder: function (ctx) {
            ctx.strokeStyle = 'white';
            ctx.strokeRect(30, 30, 840, 390);
        },
        drawMinusRectangle: function (ctx) {
            ctx.fillStyle = 'red';
            ctx.fillRect(120, 216, 45, 9);
        },
        drawZeroEllipse: function (ctx) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 9;
            ctx.beginPath();
            ctx.ellipse(360, 216, 30, 45, 0, 0, 2 * Math.PI);
            ctx.stroke();
        },
        drawPercentageCircle: function (ctx, x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2 * Math.PI);
            ctx.stroke();
        },
        drawPercentageLine: function (ctx) {
            ctx.beginPath();
            ctx.moveTo(480, 264);
            ctx.lineTo(540, 186);
            ctx.closePath();
            ctx.stroke();
        }
    }
});

/*********************************************************************************************************************
 * workaround outside of vue as vue v-on:click doesn't stop form submit when return value is falsy
 * this could either be caused by a bug in vue itself or my lack of experience in vue
 *********************************************************************************************************************/
let validateForm = function (e) {
    let valid = true;
    obj.formInputs.forEach((input) => {

        let value = obj.order[input.name];

        if (input.type === "date" && value) {
            let date = new Date(value);
            let today = new Date();
            if (date && date.getTime() <= today.getTime()) {
                let errorMessage = "Bitte geben Sie bei \"" + input.label + "\" ein Datum in der Zukunft ein.";
                if (!obj.formErrorList.includes(errorMessage)) {
                    obj.formErrorList.push(errorMessage); // custom js error as mentioned in assignment
                }
                valid = false;
                obj.formSuccess = false;
            }
        }
    })
    return valid;
}

