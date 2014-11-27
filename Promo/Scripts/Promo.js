(function ($) {
    ////////////////////////////////////////////////////////// атрибуты
    var messagerequired = "Required value!";
    var messagerange = "{0} must be between {1} and {2}";
    var messageregex = "No format";
    var messagelength = "length no pameters";
    var messagecompare = "Importance do not coincide";
    var regexPattern = 'data-val-regex-pattern';
    var dataNumberRange = 'data-val-number';
    var dataValLenght = 'data-val-length';
    var dataValRangeMax = 'data-val-range-max';
    var dataValRangeMin = 'data-val-range-min';
    var dataValLengthMax = 'data-val-length-max';
    var dataValLengthMin = 'data-val-length-min';
    var dataValCompareName = 'data-val-compare-name';
    var dataValCompareText = 'data-val-compare';
    var dataValRemoteUrl = 'data-val-remote-url';
    var dataValRemoteElements = 'data-val-remote-elements';
    var dataRemoteIsSettings = 'data-remote-setting';
    var dataValReguredText = 'data-val-required';
    var dataValRegexText = 'data-val-regex';
    ////////////////////////////////////////////////////////// опции валидации
    var optionValidateRequired = 'required';
    var optionValidateMsgRequired = 'msgrequired';
    var optionValidateRegex = 'regex';
    var optionValidateMsgRegex = 'msgregex';
    var optionValidateMaxvalue = 'maxvalue';
    var optionValidateMsgrange = 'msgrange';
    var optionValidateMinvalue = 'minvalue';
    var optionValidateMaxlength = 'maxlength';
    var optionValidateMsglength = 'msglength';
    var optionValidateMinlength = 'minlength';
    var optionValidateCompare = 'compare';
    var optionValidateMsgcompare = 'msgcompare';
    var optionValidateRemoteurl = 'remoteurl';
    var optionValidateRemoteelements = 'remoteelements';
    var optionValidateRemoteajaxsetting = 'remoteajaxsetting';

    var errorlabel = "<span class=\"field-validation-error\" data-valmsg-replace=\"true\" data-valmsg-for=\"{0}\">" +
        "<span class=\"\" htmlfor=\"{0}\" generated=\"true\">{1}</span></span><br />";

    if (!String.format) {
        String.format = function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }

    $.fn.setCursorPosition = function (pos) {
        this.each(function (index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

    $.fn.getCursorPosition = function () {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            var selLength = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            pos = sel.text.length - selLength;
        }
        return pos;
    };

    Array.prototype.contains = function (val) {
        for (var j = 0; j <= this.length - 1; j++) {
            if (this[j] == val) return true;
        }
        return false;
    };

    function isStringEmpty(str) {

        if (str == null) return true;
        if (str.length == 0)
            return true;
        if (str.replace(/\s/g, "") == "")
            return true;

        return false;
    }

    String.prototype.hashCode = function () {
        var hash = 0, i, chr, len;
        if (this.length == 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    };

    $.fn.extend({
        'Promo': function (options) {

            options = $.extend({
                filterattribute: null,
                buttonprevious: null,
                buttonnext: null,
                ajaxoptions: {
                    data: null,
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'html',
                    crossDomain: false,
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    dataFilter: null,
                    timeout: 0,
                    beforeSend: null,
                    success: null,
                    error: null,
                    complete: null
                },

                eventbeforesend: null,
                eventcommit: null,

            }, options);

            //////////////////// 
            var promo = {};
            var buttons = [];
            var currentPage;
            var countPage;
            var currentUrl = '';

            var currentActionUrl = '';
            ////////////////////
            var innerFun = {
                //позиция курсора в тексте
                getpositioner: function (o) {

                    var resss = {
                        istext: false,
                        isarray: false,
                        position: 0,
                        counter: 0,
                        name: '',
                        value: ''
                    };
                    var oo = $(o);
                    resss.name = $(o).attr('name');
                    if (oo.is('input:text') || oo.is('textarea')) {
                        resss.istext = true;
                        resss.position = oo.getCursorPosition();

                        return resss;
                    }
                    if (oo.is('input:checkbox') || oo.is('input:radio')) {

                        if (oo.attr('value')) {
                            resss.isarray = true;
                            resss.value = oo.val();
                        }
                    }

                    return resss;
                },

                //Установка курсора в позицию
                setpositioner: function (ob) {
                    var el = $(promo.element).find('[name=' + ob.name + ']').focus();
                    if (ob.istext) {
                        el.focus();
                        el.setCursorPosition(ob.position);
                        return;
                    }
                    if (ob.isarray) {
                        el.filter('value=' + ob.value).focus();
                        return;
                    }
                    el.focus();
                },

                changeevent: function () {

                    var resd = $(promo.element).find('input,select,textarea');

                    resd.change(function () {

                        contexCache.setContext(currentUrl, JSON.stringify(innerFun.getJsonJs(null, null)));

                        if (($(this).is('input:radio') || $(this).is('input:checkbox')) && !this.getAttribute('value')) {
                            contexCache.setFocus(currentUrl, { name: this.getAttribute('name') });
                        }
                        else
                            if ($(this).is('input') || $(this).is('textarea')) {
                                contexCache.setFocus(currentUrl, { position: $(this).getCursorPosition(), name: this.getAttribute('name') });
                            }
                            else
                                if (($(this).is('input:radio') || $(this).is('input:checkbox')) && this.getAttribute('value')) {
                                    contexCache.setFocus(currentUrl, { name: this.getAttribute('name'), value: this.getAttribute('value') });

                                }
                                else
                                    if ($(this).is('select')) {
                                        contexCache.setFocus(currentUrl, { name: this.getAttribute('name') });
                                    }


                    });

                },

                ajaxPromoHtml: function (obj, url, success, usingcontent, beforeSend) {

                   // alert(url);
                    var innerData = obj;//JSON.stringify(obj);
                    if (!ajaxsettingCache.exist(url)) {
                        ajaxsettingCache.set(url);
                    }

                    var aj = ajaxsettingCache.get(url);




                    if (aj.data != null && $.isFunction(javaEnabled.data)) {
                        innerData = aj.data();
                    }

                    ///////////////////////////////////////////////// ///////////

                    $.ajax({
                        url: url,
                        type: aj.type,
                        data: innerData,
                        dataType: aj.dataType,
                        cache: aj.cache,
                        async: aj.async,
                        dataFilter: aj.dataFilter,
                        timeout: aj.timeout,
                        crossDomain: aj.crossDomain,
                        contentType: aj.contentType,
                        success: function (data, a) {
                            if (aj.success != null) {
                                aj.success(data, a);
                            } else {
                                success(data);
                            }
                        },
                        beforeSend: function () {
                            if (aj.beforeSend != null) {
                                return aj.beforeSend();
                            } else {
                                return beforeSend();
                            }
                        },
                        complete: function (xmlHttpRequest, textStatus) {
                          //  alert(aj.complete);
                            if (aj.complete != null) {
                                aj.complete(xmlHttpRequest, textStatus);
                            }

                        },
                        error: function (jqXhr, a, b) {
                            if (aj.error == null) {
                                if (jqXhr.status == 500) {
                                    alert('Internal error: ' + jqXhr.responseText);
                                } else {
                                    alert('Unexpected error.' + jqXhr.responseText);
                                }
                            } else {
                                aj.error(jqXhr, a, b);
                            }
                        }
                    });
                },

                promoPurpose: function (ajax) {

                    var objs = JSON.parse(ajax);

                    var el = $(promo.element).find('input ,select,textarea,div ,img ');
                    el.removeClass('input-validation-error');
                    $(promo.element).find('.field-validation-error').remove();

                    $.each(el, function () {
                        var ion = $(this);
                        var name = this.getAttribute('name');
                        if (ion.is('input:checkbox') && !this.getAttribute('value')) {
                            if (objs[name] == true) {
                                ion.attr('checked', 'checked');
                            } else {
                                ion.removeAttr('checked');;
                            }
                        }
                        else
                            if (((ion.is('input:checkbox') && this.getAttribute('value')) || ion.is('input:radio') && this.getAttribute('value')) && Array.isArray(objs[name])) {
                                if (objs[name].contains(this.getAttribute('value'))) {
                                    ion.prop('checked', true);
                                }
                                else {
                                    ion.prop('checked', false);
                                }
                            }
                            else
                                if (ion.is('select') && objs[name]) {

                                    ion.val(objs[name]);
                                }
                                else
                                    if (ion.is('div') && ion.attr('data-name') && objs[this.getAttribute('data-name')]) {

                                        ion.empty().append(objs[this.getAttribute('data-name')]);
                                    }
                                    else
                                        if (ion.is('img') && ion.attr('data-name') && objs[this.getAttribute('data-name')]) {
                                            ion.attr('src', objs[this.getAttribute('data-name')]);
                                        }
                                        else
                                            if ((ion.is('input') || ion.is('textarea')) && objs[name]) {
                                                this.value = objs[name];

                                            }
                    });

                    var oso = $(promo.element).find('input  ,select,textarea');//фокус установка
                    if (contexCache.exist(currentUrl)) {

                        var foc = contexCache.getFocus(currentUrl);
                        if (foc != undefined) {

                            if (foc.value == undefined) {
                                var r = oso.filter('[name=' + foc.name + ']');
                                r.focus();
                                if (foc.position != undefined) {
                                    r.setCursorPosition(foc.position);
                                }

                            } else {
                                var re = oso.filter('[name=' + foc.name + ']').filter('[value=' + foc.value + ']');
                                re.focus();
                            }

                        } else {
                            oso.filter('[data-focus]').focus();
                        }
                    } else {
                        oso.filter('[data-focus]').focus();
                    }
                },

                addinFocus: function (focus) {
                    if ($(focus).is('a') || $(focus).is('input:button')) {
                        return;
                    }
                    if (($(focus).is('input:radio') || $(focus).is('input:checkbox')) && !$(focus).attr('value')) {
                        contexCache.setFocus(currentUrl, { name: $(focus).attr('name') });
                    }
                    else
                        if ($(focus).is('input') || $(focus).is('textarea')) {
                            contexCache.setFocus(currentUrl, { position: $(focus).getCursorPosition(), name: $(focus).attr('name') });
                        }
                        else
                            if (($(focus).is('input:radio') || $(focus).is('input:checkbox')) && $(focus).attr('value')) {
                                contexCache.setFocus(currentUrl, { name: $(focus).attr('name'), value: $(focus).attr('value') });
                            }
                            else
                                if ($(focus).is('select')) {
                                    contexCache.setFocus(currentUrl, { name: $(focus).attr('name') });
                                }
                },

                getJsonJs: function (elements, filter) {

                    var to;
                    if (filter == null) {
                        to = $(promo.element).find('input,select,textarea,div ,img ');
                    } else {
                        to = $(promo.element).find('input,select,textarea,div ,img ').filter(filter);

                    }

                    var objs = {};
                    if (to.length == 0) {
                        return objs;
                    }
                    $.each(to, function () {
                        var i;
                        var name = this.getAttribute('name');
                        if (elements != null) {
                            if (elements.indexOf(name) == -1)
                                return;
                        }

                        if ($(this).is('input:radio') && this.checked == true) {
                            objs[name] = this.value;
                        } else
                            if ($(this).is('select') && this.multiple == false) {
                                objs[name] = this.value;
                            }
                            else
                                if ($(this).is('select') && this.multiple == true) {

                                    var arr = [];
                                    if ($.browser == "msie") {
                                        for (i = 0; i < this.all.length; i++) {
                                            if (this.all.item(i).selected == true) {
                                                arr.push(this.all.item(i).value);
                                            }
                                        }
                                        objs[name] = arr;
                                    } else {
                                        objs[name] = $(this).val();
                                    }
                                }
                                else
                                    if ($(this).is('input:checkbox') && !$(this).attr('value')) {

                                        objs[name] = this.checked;
                                    }
                                    else
                                        if ($(this).is('div') && this.getAttribute('data-name')) {
                                            objs[this.getAttribute('data-name')] = $(this).html();
                                        }
                                        else
                                            if ($(this).is('img') && this.getAttribute('data-name')) {
                                                objs[this.getAttribute('data-name')] = $(this).attr('src');
                                            }
                                            else
                                                if ($(this).is('input:checkbox') && $(this).attr('value')) {
                                                    arr = [];

                                                    if ($.browser == "msie") {
                                                        for (i = 0; i < this.all.length; i++) {
                                                            if (this.all.item(i).selected == true) {
                                                                arr.push(this.all.item(i).value);
                                                            }
                                                        }
                                                    } else {
                                                        if ($(this).prop("checked")) {
                                                            if (objs[name] == null) {
                                                                objs[name] = [];
                                                            }

                                                            objs[name].push($(this).attr('value'));
                                                        }
                                                    }
                                                }
                                                else
                                                    objs[name] = this.value;
                    }
                    );

                    return objs;
                },

                beforeSend: function (url, json, iscache) {
                    if (options.eventbeforesend != true) {
                        options.eventbeforesend(url, json, iscache);
                    }
                },

                commit: function (url, json, iscache) {
                    promo.settings.clear();
                    if (options.eventcommit != true) {
                        options.eventcommit(url, json, iscache);
                    }
                },

                elementAppender: function (data) {
                    $(promo.element).empty().append(data);
                    innerFun.validEvent();
                    innerFun.changeevent();
                },

                queryaction: function (urlquery) {
                    var curo = innerFun.getJsonJs(null, options.filterattribute);
                    var url = $(urlquery).attr('data-query-auto');
                
                    innerFun.ajaxPromoHtml(curo, url,
                       function (data) {
                           $('[data-query]').empty().append(data);
                           contexCache.set(currentUrl, promo.element.html());
                           innerFun.addinFocus($("*:focus"));
                           innerFun.commit(urlquery, data, false);
                       }
                        , true,
                        function () {
                            innerFun.beforeSend(url, null, false);
                            return true;
                        });
                },

                validEvent: function () {
                    if (!validPromo.exist(currentUrl)) return;
                    $.each(validPromo.get(currentUrl), function () {
                        var res = $(promo.element).find('[name=' + this.name + ']');

                        if (!res) return;
                        for (var prop in this) {
                            if (prop == optionValidateRequired) {
                                res.attr('data-val', this[prop]);
                                if (this[optionValidateMsgRequired] == undefined) {
                                    res.attr(dataValReguredText, messagerequired);
                                } else {
                                    res.attr(dataValReguredText, this[optionValidateMsgRequired]);
                                }
                            }
                            if (prop == optionValidateRegex) {
                                res.attr(regexPattern, this[prop]);
                                if (this[optionValidateMsgRegex] == undefined) {
                                    res.attr(dataValRegexText, messageregex);
                                } else {
                                    res.attr(dataValRegexText, this[optionValidateMsgRegex]);
                                }
                            }
                            if (prop == optionValidateMaxvalue) {
                                res.attr(dataValRangeMax, this[prop]);
                                if (!res.attr(dataNumberRange)) {
                                    if (this[optionValidateMsgrange] == undefined) {
                                        res.attr(dataNumberRange, messagerange);
                                    } else {
                                        res.attr(dataNumberRange, this[optionValidateMsgrange]);
                                    }
                                }

                            }
                            if (prop == optionValidateMinvalue) {
                                res.attr(dataValRangeMin, this[prop]);
                                if (!res.attr(dataNumberRange)) {
                                    if (this[optionValidateMsgrange] == undefined) {
                                        res.attr(dataNumberRange, messagerange);
                                    } else {
                                        res.attr(dataNumberRange, this[optionValidateMsgrange]);
                                    }
                                }

                            }
                            if (prop == optionValidateMaxlength) {
                                res.attr(dataValLengthMax, this[prop]);
                                if (!res.attr(dataValLenght)) {
                                    if (this[optionValidateMsglength] == undefined) {
                                        res.attr(dataValLenght, messagelength);
                                    } else {
                                        res.attr(dataValLenght, this[optionValidateMsglength]);
                                    }
                                }
                            }
                            if (prop == optionValidateMinlength) {
                                res.attr(dataValLengthMin, this[prop]);
                                if (!res.attr(dataValLenght)) {
                                    if (this[optionValidateMsglength] == undefined) {
                                        res.attr(dataValLenght, messagelength);
                                    } else {
                                        res.attr(dataValLenght, this[optionValidateMsglength]);
                                    }
                                }
                            }
                            if (prop == optionValidateCompare) {
                                res.attr(dataValCompareName, this[prop]);
                                if (!res.attr(dataValCompareText)) {
                                    if (this[optionValidateMsgcompare] == undefined) {
                                        res.attr(dataValCompareText, messagecompare);
                                    } else {
                                        res.attr(dataValCompareText, this[optionValidateMsgcompare]);
                                    }
                                }
                            }
                            if (prop == optionValidateRemoteurl) {
                                res.attr(dataValRemoteUrl, this[prop]);
                                if (this[optionValidateRemoteelements]) {
                                    res.attr(dataValRemoteElements, this[optionValidateRemoteelements]);
                                }
                                if (this[optionValidateRemoteajaxsetting]) {
                                    res.attr(dataRemoteIsSettings, true);
                                    promo.settings.ajax = this[optionValidateRemoteajaxsetting];
                                    ajaxsettingCache.set(this[prop]);
                                }
                                res.keyup(function () {

                                    var r = [];
                                    if (this.getAttribute(dataValRemoteElements) != null) {
                                        r = this.getAttribute(dataValRemoteElements).split(',');
                                    }
                                    r.push(this.getAttribute('name'));

                                    var data = innerFun.getJsonJs(r, null);

                                    var nameparent = this.getAttribute('name');
                                    var urlremote = this.getAttribute(dataValRemoteUrl);
                                    //obj, url, success, usingcontent, beforeSend
                                    innerFun.ajaxPromoHtml(data, urlremote, function (dat) {
                                        if (!isStringEmpty(dat)) {

                                            $(promo.element).find('[name=' + nameparent + ']').
                                                after("<div class='field-validation-error' data-remove-res-name='" + nameparent + "' >" + dat + " </div>");
                                        }
                                        innerFun.commit(urlremote, dat, false);
                                    }, false, function () {
                                        $('[data-remove-res-name=' + nameparent + ']').remove();
                                        innerFun.beforeSend(urlremote, null, false);
                                    });
                                });
                            }
                        }
                        res.change(function (event) {

                            var e = Number(innerFun.validateRegured(this)) +
                                Number(innerFun.validateRegex(this)) +
                                Number(innerFun.validateRange(this)) +
                                Number(innerFun.validateRangelength(this)) +
                                Number(innerFun.validateCompare(this)) +
                                Number(innerFun.validatRemote(this));
                            promo.validing = promo.validing + e;
                            if (e != 0) {
                                event.stopImmediatePropagation();
                            }
                        });
                    });
                },

                addKeyUpValidate: function (ob) {
                    var ev = $._data(ob, 'events');
                    if (ev && !ev.keyup) {

                        $(ob).keyup(function () {
                            innerFun.validateRegured(this);
                            innerFun.validateRegex(this);
                            innerFun.validateRange(this);
                            innerFun.validateRangelength(this);
                            innerFun.validateCompare(this);
                        });
                    }
                },

                validateRegured: function (ob) {
                    var o = $(ob);
                    if (o.attr('data-val')) {

                        if (isStringEmpty(o.val())) {

                            innerFun.addErrorMsg(o, dataValReguredText);
                            innerFun.addKeyUpValidate(ob);
                            return 1;

                        } else {
                            innerFun.removeErrorMsg(o);
                            return 0;
                        }
                    }
                    return 0;

                },

                validateRegex: function (ob) {
                    var o = $(ob);
                    var atr = o.attr(regexPattern);
                    if (atr) {
                        var reg = new RegExp(atr.substr(1, atr.length - 2));
                        if (!reg.test(o.val())) {
                            innerFun.addErrorMsg(o, dataValRegexText);
                            innerFun.addKeyUpValidate(ob);
                            return 1;
                        } else {
                            innerFun.removeErrorMsg(o);
                            return 0;
                        }
                    }
                    return 0;

                },

                validateRange: function (ob) {
                    var o = $(ob);


                    if (o.attr(dataNumberRange)) {

                        if (isStringEmpty(o.val())) {
                            innerFun.addErrorMsg(o, dataNumberRange);
                            innerFun.addKeyUpValidate(ob);
                            return 1;
                        }
                        var val = Number(o.val());
                        var max = Number(o.attr(dataValRangeMax));
                        var min = Number(o.attr(dataValRangeMin));



                        if (max && min) {

                            if (val >= min && val <= max) {
                                innerFun.removeErrorMsg(o);
                                return 0;

                            } {
                                innerFun.addErrorMsg(o, dataNumberRange);
                                innerFun.addKeyUpValidate(ob);
                                return 1;
                            }
                        }
                        if (!max && min) {

                            if (val >= min) {
                                innerFun.removeErrorMsg(o);
                                return 0;

                            } else {
                                innerFun.addErrorMsg(o, dataNumberRange);
                                innerFun.addKeyUpValidate(ob);
                                return 1;
                            }
                        }
                        if (max && !min) {

                            if (val <= max) {
                                innerFun.removeErrorMsg(o);
                                return 0;

                            } else {
                                innerFun.addErrorMsg(o, dataNumberRange);
                                innerFun.addKeyUpValidate(ob);
                                return 1;
                            }
                        }
                    }
                    return 0;

                },

                validateRangelength: function (ob) {
                    var o = $(ob);

                    if (o.attr(dataValLenght)) {

                        var val = o.val().length;
                        var max = Number(o.attr(dataValLengthMax));
                        var min = Number(o.attr(dataValLengthMin));

                        if (max && min) {
                            if (val >= min && val <= max) {
                                innerFun.removeErrorMsg(o);
                                return 0;

                            } else {
                                innerFun.addErrorMsg(o, dataValLenght);
                                innerFun.addKeyUpValidate(ob);
                                return 1;
                            }
                        } else
                            if (!max && min) {
                                if (val >= min) {
                                    innerFun.removeErrorMsg(o);
                                    return 0;

                                } else {
                                    innerFun.addErrorMsg(o, dataValLenght);
                                    innerFun.addKeyUpValidate(ob);
                                    return 1;
                                }
                            } else
                                if (max && !min) {
                                    if (val <= max) {
                                        innerFun.removeErrorMsg(o);
                                        return 0;

                                    } else {
                                        innerFun.addErrorMsg(o, dataValLenght);
                                        innerFun.addKeyUpValidate(ob);
                                        return 1;
                                    }
                                }
                    }
                    return 0;
                },

                validateCompare: function (ob) {
                    var o = $(ob);
                    var atr = o.attr(dataValCompareName);
                    if (atr) {
                        var val = promo.element.find('[name=' + atr + ']').val();
                        if (val !== o.val() || val.length == 0 || o.val().length == 0) {
                            innerFun.addErrorMsg(o, dataValCompareText);
                            innerFun.addKeyUpValidate(ob);
                            return 1;

                        } else {
                            innerFun.removeErrorMsg(o);
                            return 0;
                        }
                    }
                    return 0;
                },

                removeErrorMsg: function (object) {
                    object.removeClass('input-validation-error');
                    $('[data-valmsg-for=' + object.attr('name') + ']').remove();
                },

                validatRemote: function () {
                    return $('div .field-validation-error').length;
                },

                addErrorMsg: function (object, strAttrName) {
                    if ($('[data-valmsg-for=' + object.attr('name') + ']').length == 0) {
                        object.addClass('input-validation-error');
                        object.after($(String.format(errorlabel, object.attr('name'), object.attr(strAttrName)))[0]);
                    }
                },

                purposeQueryAuto: function () {
                    var rr = $(promo.element).find('[data-query-auto]');
                    $.each(rr, function () {
                        var e = $(this);
                     
                        if (e.is('input:radio') || e.is('input:checkbox') || e.is('select')) {
                            e.change(function () {
                                innerFun.queryaction(this);
                            });
                        }
                        else
                            if (e.is('div')) {
                            } else {
                                e.keyup(function () {
                                    innerFun.queryaction(this);
                                });
                            }
                    });
                },
            };

            var contexCache = {
                data: {},

                remove: function (url) {
                    delete contexCache.data[url];
                },
                exist: function (url) {

                    return contexCache.data.hasOwnProperty(url) && contexCache.data[url] !== null;
                },
                get: function (url) {
                    return contexCache.data[url];
                },
                set: function (url, cachedData) {
                    contexCache.remove(url);

                    contexCache.data[url] = {
                        html: cachedData,
                        contex: JSON.stringify(innerFun.getJsonJs(null, null)),

                    };
                },
                setContext: function (url, datacontext) {
                    contexCache.data[url].contex = datacontext;
                },
                getContex: function (url) {
                    return contexCache.data[url].contex;
                },
                getHtml: function (url) {
                    return contexCache.data[url].html;
                },
                setFocus: function (url, focus) {
                    contexCache.data[url].focus = focus;
                },
                getFocus: function (url) {
                    return contexCache.data[url].focus;
                },

            };

            var modelPromo = {
                clear: function (url) {

                    var str = [];

                    for (var name in modelPromo.datas) {
                        if (name.substring(0, name.indexOf('##')) == url) {
                            str.push(name);
                        }
                        str.forEach(function (d) {
                            delete modelPromo.datas[d];
                        });

                    }

                },
                datas: {},
                remove: function (url) {
                    url = currentUrl + '##' + url;
                    delete modelPromo.datas[url];
                },
                exist: function (url) {

                    url = currentUrl + '##' + url;
                    return modelPromo.datas.hasOwnProperty(url) && modelPromo.datas[url] !== null;
                },
                get: function (url) {
                    url = currentUrl + '##' + url;
                    return modelPromo.datas[url];
                },
                set: function (url, cachedData) {

                    url = currentUrl + '##' + url;
                    modelPromo.remove(url);
                    modelPromo.datas[url] = cachedData;

                }
            };

            var validPromo = {
                datas: {},
                remove: function (url) {
                    delete validPromo.datas[url];
                },
                exist: function (url) {
                    return validPromo.datas.hasOwnProperty(url) && validPromo.datas[url] !== null;
                },
                get: function (url) {
                    return validPromo.datas[url];
                },
                set: function (url) {
                    validPromo.remove(url);
                    validPromo.datas[url] = promo.validateObjects;
                    promo.validateObjects = null;
                }
            };

            var ajaxsettingCache = {
                datas: {},
                remove: function (url) {
                    delete ajaxsettingCache.datas[url];
                },
                exist: function (url) {
                    return ajaxsettingCache.datas.hasOwnProperty(url) && ajaxsettingCache.datas[url] !== null;
                },
                get: function (url) {
                    return ajaxsettingCache.datas[url];
                },
                set: function (url) {

                    if (!ajaxsettingCache.exist(url)) {
                        var newObject = $.extend({}, promo.settings.ajax);
                        ajaxsettingCache.datas[url] = newObject;
                    }
                    promo.settings.clear();

                }
            };

            promo['currentUrl'] = function () {
                return currentUrl;
            };

            promo['validing'] = null;

            promo['innerFunction'] = innerFun;
            //Элемент области
            promo["element"] = $(this);

            //удаляет контекст для представления
            promo["removeContexCache"] = function (url) {
                contexCache.remove(url);
            };

            //удаляет кеш модели удаляются все модели для области
            promo["removeCacheModel"] = function (url) {
                modelPromo.remove(url);
            };

            promo["removeCacheModelForView"] = function (url) {
                modelPromo.clear(url);
            };
            // функция для вложенных областей
            promo['innerReload'] = function (objPromo) {

                promo.element = objPromo;
                if (isStringEmpty(currentUrl)) {
                    return;
                }

                promo.getHtml(currentUrl);
            },

            // получение разметки с задействованием контекста
            promo['getHtml'] = function (url, isbuttons) {
                if (isbuttons == null) {

                    ajaxsettingCache.set(url);
                    validPromo.set(url);

                }

                if (options.buttonnext != null && options.buttonprevious != null) {
                    if (isbuttons == null) { //если вызов не из кнопки навигации 

                        if (currentPage > 0 && currentPage < buttons.length) {
                            buttons = buttons.slice(0, Number(currentPage));
                        }

                        if (buttons.length == 0 || (buttons.length > 0 && buttons[buttons.length - 1].url != url)) {
                            buttons.push({ url: url });
                        }


                        currentPage = buttons.length;
                        countPage = buttons.length;



                        if (currentPage == 1 && options.buttonprevious != null) {
                            $(options.buttonprevious).css('cursor', 'default').unbind();
                        } else {

                            $(options.buttonprevious).css('cursor', 'pointer').unbind().click(function () {
                                promo.previous();
                            });
                        }
                        if (options.buttonnext != null) {

                            $(options.buttonnext).css('cursor', 'default').unbind();
                        }

                    } else {

                        if (currentPage == 1 && options.buttonprevious != null) {
                            $(options.buttonprevious).css('cursor', 'default').unbind();
                        } else {
                            $(options.buttonprevious).css('cursor', 'pointer').unbind().click(function () {
                                promo.previous();
                            });
                        }
                        if (Number(currentPage) == Number(countPage) && options.buttonnext != null) {

                            $(options.buttonnext).css('cursor', 'default').unbind();
                        } else {
                            $(options.buttonnext).css('cursor', 'pointer').unbind().click(function () {
                                promo.next();
                            });
                        }
                    }
                }
                var curo = {};
                innerFun.ajaxPromoHtml(curo, url,
                   function (data) {

                       currentUrl = url;
                       innerFun.elementAppender(data);
                       contexCache.set(url, data);
                       innerFun.promoPurpose(contexCache.getContex(url));
                       ////////////////////////
                       innerFun.purposeQueryAuto();
                       //////////////////////////
                       innerFun.commit(url, data, false);
                   }
                    , true,
                    function () {
                        if (contexCache.exist(url)) {
                            currentUrl = url;
                            innerFun.elementAppender(contexCache.getHtml(url));
                            innerFun.promoPurpose(contexCache.getContex(url));
                            ////////////////////////
                            innerFun.purposeQueryAuto();
                            //////////////////////////
                            innerFun.commit(url, curo, true);
                            return false;
                        }
                        innerFun.beforeSend(url, curo, false);
                        return true;
                    });
            };
            // получение разметки минуя контекст,  используется для кнопок
            promo['getHtmlNoContex'] = function (url) {

                contexCache.remove(url);
                var curo = innerFun.getJsonJs(null, options.filterattribute);
                innerFun.ajaxPromoHtml(curo, url,
                     function (data) {
                         var el = promo.element.find('[data-query]');
                         if (el.length == 1) {
                             el.empty().append(data);
                             contexCache.set(currentUrl, promo.element.html());
                             innerFun.addinFocus($("*:focus"));
                             innerFun.commit(url, data, false);
                         } else {
                             innerFun.elementAppender(data);
                             contexCache.set(currentUrl, data);
                             innerFun.commit(url, data, false);
                         }
                     }
                     , false,
                     function () {
                         innerFun.beforeSend(url, null, false);
                         return true;
                     }
                 );
            };
            // действие кнопки
            promo['action'] = function (url) {

                ajaxsettingCache.set(url);
                if (isStringEmpty(currentUrl)) {
                    return;
                }
                modelPromo.remove(currentActionUrl);
                promo.getHtmlNoContex(url);

            };
            //получение модели
            promo['getModel'] = function (url) {

                ajaxsettingCache.set(url);
                currentActionUrl = url;
                if (modelPromo.exist(url)) {
                    innerFun.promoPurpose(modelPromo.get(url));
                    innerFun.commit(url, modelPromo.get(url), true);
                    return;
                }

                innerFun.ajaxPromoHtml({}, url, function (dat) {
                    innerFun.promoPurpose(dat);
                    modelPromo.set(url, dat);
                    innerFun.commit(url, dat, false);
                    contexCache.setContext(currentUrl, JSON.stringify(innerFun.getJsonJs(null, null)));
                }, true, function () {
                    innerFun.beforeSend(url, null, false);
                });
            };

            // перегрузка формы
            promo['reload'] = function () {
                if (isStringEmpty(currentUrl)) {
                    return;
                }
                modelPromo.clear(currentUrl);
                contexCache.remove(currentUrl);
                promo.getHtmlNoContex(currentUrl);
            };

            //настройки запроса ( кроме автозапроса)
            promo['settings'] = {
                query: false,
                ajax: {
                    crossDomain: options.ajaxoptions.crossDomain,
                    data: options.ajaxoptions.data,
                    type: options.ajaxoptions.type,
                    contentType: options.ajaxoptions.contentType,
                    complete: options.ajaxoptions.complete,
                    success: options.ajaxoptions.success,
                    async: options.ajaxoptions.async,
                    dataFilter: options.ajaxoptions.dataFilter,
                    timeout: options.ajaxoptions.timeout,
                    cache: options.ajaxoptions.cache,
                    dataType: options.ajaxoptions.dataType,
                    beforeSend: options.ajaxoptions.beforeSend,
                    error: options.ajaxoptions.error,
                },
                clear: function () {
                    promo.settings.ajax.crossDomain = options.ajaxoptions.crossDomain;
                    promo.settings.ajax.data = options.ajaxoptions.data;
                    promo.settings.ajax.type = options.ajaxoptions.type;
                    promo.settings.ajax.contentType = options.ajaxoptions.contentType;
                    promo.settings.ajax.complete = options.ajaxoptions.complete;
                    promo.settings.ajax.success = options.ajaxoptions.success;
                    promo.settings.ajax.async = options.ajaxoptions.async;
                    promo.settings.ajax.dataFilter = options.ajaxoptions.dataFilter;
                    promo.settings.ajax.cache = options.ajaxoptions.cache;
                    promo.settings.ajax.timeout = options.ajaxoptions.timeout;
                    promo.settings.ajax.beforeSend = options.ajaxoptions.beforeSend;
                    promo.settings.ajax.error = options.ajaxoptions.error;
                    promo.settings.ajax.dataType = options.ajaxoptions.dataType;

                    promo.settings.query = false;
                }
            };

            promo['validateObjects'] = null;

            promo['validate'] = function () {

                if (!validPromo.exist(currentUrl)) return true;
                promo.validing = 0;
                $.each(validPromo.get(currentUrl), function () {
                    $(promo.element).find('[name=' + this.name + ']').change();
                });
                return promo.validing == 0;

            };

            promo['previous'] = function () {
                if (currentPage == 1) {
                    return;
                }
                currentPage = Number(currentPage) - 1;
                var i = Number(currentPage);
                promo.getHtml(buttons[i - 1].url, true);

            };

            promo['next'] = function () {
                if (currentPage == countPage) {
                    return;
                }
                currentPage = Number(currentPage) + 1;
                var i = Number(currentPage);
                promo.getHtml(buttons[i - 1].url, true);
            };

            return promo;
        }
    });

})(jQuery);