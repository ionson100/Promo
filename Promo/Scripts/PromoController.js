
var res, res1;
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
        res.settings.ajax.complete = function () {
            //data-query-auto="/Example2/QueryUserData/3"
            var ee = $('[name=Username]');

            ee.attr('data-query-auto', 'http://ion100.ru/Example2/QueryUserData/3');
        };
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
    },
    Example5: function () {
        res.getHtml('http://ion100.ru/Example5/Example5Html/334');
    },
    /////////////////////////////////////////////////////////
    Add2: function () {
        res1.settings.ajax.crossDomain = true;
        res1.settings.ajax.dataType = "text";
        res1.settings.lastappender = function () {
            Pizdaticus2();
        };
        if (res1.validate())
            res1.action('http://ion100.ru/Example/AddBaseP/12');
    },

    Edit2: function () {
        res1.settings.ajax.crossDomain = true;
        res1.settings.ajax.dataType = "text";
        res1.settings.lastappender = function () {
            Pizdaticus2();
        };
        if (res1.validate())
            res1.action('http://ion100.ru/Example/EditBaseP/12');
    },

    Delete2: function () {
        res1.settings.ajax.crossDomain = true;
        res1.settings.ajax.dataType = "text";
        res1.settings.lastappender = function () {
            Pizdaticus2();
        };
        res1.action('http://ion100.ru/Example/DeleteBaseP/12');
    },
    Reload2: function () {
        //res1.settings.ajax.crossDomain = true;
        //res1.settings.lastappender = function() {
        //    Pizdaticus2();
        //};
        res1.reload();
    },
    Id2: function (ass) {
        res1.settings.ajax.dataType = "text";
        res1.settings.ajax.crossDomain = true;
        res1.settings.lastappender = function () {
            Pizdaticus2();
        };
        res1.getModel('http://ion100.ru/Example/GetUser/' + $(ass).val());
    },
    Example15: function () {
        res1.settings.ajax.dataType = "text";
        res1.settings.ajax.crossDomain = true;
        res1.settings.lastappender = function () {

            Pizdaticus2();

        };

        res1.validateObjects = [{
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


        res1.getHtml('http://ion100.ru/Example/BasePHtml/888888888');


    },
    Example25: function () {
        res1.settings.ajax.dataType = "text";
        res1.settings.ajax.crossDomain = true;
        res1.settings.lastappender = function () {
            var rrr = $('[data-query-auto]');
            var ee = rrr.attr('data-query-auto');
            rrr.attr('data-query-auto', 'http://ion100.ru' + ee);
        };
        res1.getHtml('http://ion100.ru/Example2/BasePHtml/334');
    },
    
    Settings: function () {
        res.getHtml('http://ion100.ru/settings/SettingsHtml/1');
    }
};
function Pizdaticus2() {
  
    $('[name=Id]').attr('onchange', 'promoAction.Id2(this);');

    $('#editF').attr('onclick', 'promoAction.Edit2();');
    $('#addF').attr('onclick', 'promoAction.Add2();');
    $('#deleteF').attr('onclick', 'promoAction.Delete2();');
    $('#reloadF').attr('onclick', 'promoAction.Reload2();');

}