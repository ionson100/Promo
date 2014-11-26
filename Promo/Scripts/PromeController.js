
var res;
$(function () {
    res = $('#base').Promo({
        ajaxoptions: {
            dataType: 'text',
            crossDomain: true,
        },
        eventbeforesend: function (a, b, c) {
            $(".loader").show();
        },
        eventcommit: function (a, b, c) {
            $(".loader").hide();
        },
        buttonprevious: $('#prev'),
        buttonnext: $('#next')
    });
    promoAction.HeadlineHtml();
});

var promoAction = {

    HeadlineHtml: function () {

        res.getHtml('http://ion100.ru/Promo/HeadlineHtml/1');
    },
    ViewRuleHtml: function () {

        res.getHtml('http://ion100.ru/Promo/ViewRuleHtml/1');
    },
    Query: function () {
        res.getHtml('http://ion100.ru/Promo/QueryHtml/1');
    },
    Embedding: function () {
        res.getHtml('http://ion100.ru/Promo/EmbeddingHtml/1');
    },
    Validation: function () {
        res.getHtml('http://ion100.ru/Promo/ValidationHtml/1');
    },
    Example1: function () {

        res.validateObjects = [{
            name: "Username",
            required: true,
            msgrequired: 'Требует заполнения.',
        },
            {
                name: "Telephone",
                required: true,
                msgrequired: 'Требует заполнения.',

                regex: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
                msgregex: 'Не верный формат.'
            }];
        res.getHtml('http://ion100.ru/Example/BasePHtml/1');
    },
    GetUser: function (id) {
        res.getModel('http://ion100.ru/Example/GetUser/' + id);
    },
    Add: function () {
        if (res.validate()) {
            res.action('http://ion100.ru/Example/AddBaseP/1');
        }
    },
    Edit: function () {
        if (res.validate()) {
            res.action('http://ion100.ru/Example/EditBaseP/1');
        }
    },
    Delete: function () {
        res.action('http://ion100.ru/Example/DeleteBaseP/1');
    },
    Reload: function () {
        res.reload();
    },
    Example2: function () {
        res.getHtml('http://ion100.ru/Example2/BasePHtml/1');
    },
    Example3: function () {
        res.getHtml('http://ion100.ru/Example3/BasePHtml/1');

    },
    QueryHandler: function () {
        res.action('http://ion100.ru/Example3/QueryHandler/1');

    },

    Example4: function () {
        res.validateObjects = [{
            name: "name",
            required: true,
            msgrequired: 'Требует заполнения.',
        },
           {
               name: "telephone",
               required: true,
               msgrequired: 'Требует заполнения.',

               regex: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
               msgregex: 'Не верный формат.'
           },
           {
               name: "email",
               required: true,
               msgrequired: 'Требует заполнения.',

               regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/,
               msgregex: 'Не верный формат.'
           },
           {
               name: "rangevalue",
               required: true,
               msgrequired: 'Требует заполнения.',

               maxvalue: 100,
               minvalue: 10,
               msgrange: 'Только не меньше 10 и не больше 100'
           },
           {
               name: "min",
               required: true,
               msgrequired: 'Требует заполнения.',

               maxvalue: 100,
               msgrange: 'Только  меньше 100'
           },
           {
               name: "max",
               required: true,
               msgrequired: 'Требует заполнения.',

               minvalue: 10,
               msgrange: 'Только  больше 10'
           },
           {
               name: "rangestr",
               required: true,
               msgrequired: 'Требует заполнения.',

               maxlength: 10,
               minlength: 3,
               msglength: "Длина строки от 3 до 10 знаков."
           },
           {
               name: "pwd1",
               required: true,
               msgrequired: 'Требует заполнения.',
           },
           {
               name: "pwd2",
               required: true,
               msgrequired: 'Требует заполнения.',

               compare: "pwd1",
               msgcompare: "Пароли не вопадают"
           },
           {
               name: "username",
               required: true,
               msgrequired: 'Требует заполнения.',

               remoteurl: "http://ion100.ru/Example4/Remote/1",
               remoteelements: ['max', 'min'],
               remoteajaxsetting: {
                   dataType: 'text',
                   crossDomain: true,
               }

           },
           {
               name: "promot",
               required: true,
               msgrequired: 'Требует выбора.',
           }

        ];
        res.getHtml('http://ion100.ru/Example4/BasePHtml/1');

    },

    ValidateAction: function () {
        if (res.validate()) {
            res.action('http://ion100.ru/Example4/ValidateAction/1');
        }

    },
    Summary: function () {
        res.getHtml('http://ion100.ru/Summary/SummaryHtml/1');
    }
}