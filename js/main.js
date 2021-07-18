var lng = $('html').attr('lang');

$.getJSON('json/text.json', function (data) {
    var items = [];
    $.each(data[lng], function (key, val) {
        $("span." + key).html(val);
    });
});

console.log(lng);

function showMonthly() {
    if ($("article form#result div.monthly textarea").hasClass("hidden") == true) {
        $("article form#result div.monthly textarea").removeClass("hidden");
    } else {
        $("article form#result div.monthly textarea").addClass("hidden");
    }
}

function calculate() {
    var currency = $("article form#input input[name='currency']:checked").val();
    var rate = parseFloat($("article form#input input#rate").val());
    var term = parseFloat($("article form#input input#term").val());
    var sum = parseFloat($("article form#input input#sum").val());
    var capital = $("article form#input input[name='capital']:checked").val();

    if (lng == 'en' || lng == 'ru') {
        var tax = $("article form#input input#tax").val();
    }
    else {
        var tax = $("article form#input input[name='tax']:checked").val();
    }

    if (term <= 1) {
        $("article form#input div.capital").addClass("hidden");
    } else {
        $("article form#input div.capital").removeClass("hidden");
    }

    var currencySym = $("article form#input input[name='currency']:checked").next().html();
    $("article span.currency").html(currencySym);

    if ((rate !== rate) || (term !== term) || (sum !== sum)) {
        $("article form#result").addClass("hidden");
    } else {
        $("article form#result").removeClass("hidden");

        if (tax == "no") {
            $("article form#result div.tax").addClass("hidden");
        } else {
            $("article form#result div.tax").removeClass("hidden");
        }

        var subTotal = sum;
        var monthlyText = "";

        if (capital == "no") {
            var profitMonth = sum * rate * 0.01 / 12;

            if (tax != "no") {
                var profitMonthWithoutTax = profitMonth;
                profitMonth = profitMonth - profitMonth * tax * 0.01;

                var taxAm = (profitMonthWithoutTax - profitMonth) * term;
                $("article form#result input#tax").val(Math.floor(taxAm * 100) / 100 + "\u00A0" + currencySym);
            }

            for (i = 1; i <= term; i++) {
                subTotal += profitMonth;
                subProfit = subTotal - sum;
                monthlyText += "#" + i + ": +" + Math.floor(subProfit * 100) / 100 + " = " + Math.floor(subTotal * 100) / 100 + " " + currencySym + "&#13;&#10;";
            }

            var profit = subProfit;

            $("article form#result div.in-month").removeClass("hidden");
            $("article form#result input#in-month").val(Math.floor(profitMonth * 100) / 100 + "\u00A0" + currencySym);

        } else {
            for (i = 1; i <= term; i++) {
                subProfit = subTotal * rate * 0.01 / 12;
                subTotal += subProfit;
                monthlyText += "#" + i + ": +" + Math.floor(subProfit * 100) / 100 + " = " + Math.floor(subTotal * 100) / 100 + " " + currencySym + "&#13;&#10;";
            }

            var profit = subTotal - sum;

            if (tax != "no") {
                var taxAm = profit * tax * 0.01;
                profit -= taxAm;

                $("article form#result input#tax").val(Math.floor(taxAm * 100) / 100 + "\u00A0" + currencySym);
            }

            $("article form#result div.in-month").addClass("hidden");

        }

        $("article form#result div.monthly textarea").html(monthlyText.substring(0, monthlyText.length - 10));

        $("article form#result input#profit").val(Math.floor(profit * 100) / 100 + "\u00A0" + currencySym);

        var total = sum + profit;
        $("article form#result input#total").val(Math.floor(total * 100) / 100 + "\u00A0" + currencySym);

        if (term == 1) {
            $("article form#result div.monthly").addClass("hidden");
            if (capital == "no") {
                $("article form#result div.in-month").addClass("hidden");
            }
        } else {
            $("article form#result div.monthly").removeClass("hidden");

            if (capital == "no") {
                $("article form#result div.in-month").removeClass("hidden");
            }
        }
    }
}
