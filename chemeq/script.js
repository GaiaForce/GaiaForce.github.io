var itemArr, data;

function initialize() {

    $(document).ready(function() {
        $.getJSON('../items.json', function(d) {
            console.log(d);
            itemArr = d.a;
        });

        $.getJSON('../formulae.json', function(d) {
            console.log(d);
            data = d;
        });

    });
    var search_btn = document.getElementById("search_btn");
    search_btn.onclick = search;
    search_btn.textContent = 'Search!';
    var add_btn = document.getElementById("add_btn");
    add_btn.onclick = add;
    add_btn.textContent = 'Add!';
}

setTimeout(initialize, 5000);


var chemNameArr = [];

function loadDatalist() {

    itemArr.sort();

    var s = "";
    for (let i=0, l=itemArr.length; i<l; i++) {
        chemArr = itemArr[i];
        sss = chemArr[0];
        chemNameArr.push(sss)
        // \u208X
        sss = sss.replace(/₀/g, "0");
        sss = sss.replace(/₁/g, "1");
        sss = sss.replace(/₂/g, "2");
        sss = sss.replace(/₃/g, "3");
        sss = sss.replace(/₄/g, "4");
        sss = sss.replace(/₅/g, "5");
        sss = sss.replace(/₆/g, "6");
        sss = sss.replace(/₇/g, "7");
        sss = sss.replace(/₈/g, "8");
        sss = sss.replace(/₉/g, "9");
        // \u207X
        sss = sss.replace(/⁰/g, "0");
        sss = sss.replace(/⁴/g, "4");
        sss = sss.replace(/⁵/g, "5");
        sss = sss.replace(/⁶/g, "6");
        sss = sss.replace(/⁷/g, "7");
        sss = sss.replace(/⁸/g, "8");
        sss = sss.replace(/⁹/g, "9");
        sss = sss.replace(/⁺/g, "+"); // A
        sss = sss.replace(/⁻/g, "-"); // B
        // \u00B
        sss = sss.replace(/²/g, "2");
        sss = sss.replace(/³/g, "3");
        sss = sss.replace(/¹/g, "1"); // 9

        var ss = "";
        for (let j=0, ll=chemArr[1].length; j<ll; j++) {
            ss += chemArr[1][j];
            ss += ", ";
        }
        ss += sss;
        s += "<option value=\"" + chemArr[0] + "\">" + ss + "</option>"
    }
    document.getElementById("chem_namelist").innerHTML = s;
}

setTimeout(loadDatalist, 6000)

var reactantArr = {};
var productArr = {};
var t = 0;

function stringify(reactant, product) {
    a = [];
    b = [];
    p = " ⟶ ";
    for (var i=0, l=Object.keys(reactant).length; i<l; i++) {
        chemName = Object.keys(reactant)[i];
        amount = reactant[chemName][0];
        state = reactant[chemName][1];
        if (state != "ns") {
            state = " (" + reactant[chemName][1] + ")";
        } else {
            state = "";
        }
        if (amount == 1) {
            a.push(chemName + state);
        } else {
            a.push(amount.toString() + chemName + state);
        }
    }
    for (var i=0, l=Object.keys(product).length; i<l; i++) {
        chemName = Object.keys(product)[i];
        amount = product[chemName][0];
        state = product[chemName][1];
        if (state != "ns") {
            state = " (" + product[chemName][1] + ")";
        } else {
            state = "";
        }
        if (amount == 1) {
            b.push(chemName + state);
        } else {
            b.push(amount.toString() + chemName + state);
        }
    }

    return a.join(" + ") + p + b.join(" + ");
}

function update(side) {
    var sideList = document.getElementById(side+"_list");
    if (side == "reactant") {
        sideArr = reactantArr;
    } else if (side == "product") {
        sideArr = productArr;
    }
    while (sideList.firstChild) {
        sideList.removeChild(sideList.firstChild);
    }
    for (var i=0, l=Object.keys(sideArr).length; i<l; i++) {
        var newItem = document.createElement("li");
        chemName = Object.keys(sideArr)[i];
        a = "";
        if (sideArr[chemName][0] == 0) {
            a = "-";
        } else if (sideArr[chemName][0] == 1) {
            a = "";
        } else {
            a = sideArr[chemName][0];
        }
        b = "";
        if (sideArr[chemName][1] == "ns") {
            b = ""
        } else {
            b = " (" + sideArr[chemName][1] + ")"
        }
        newItem.appendChild(document.createTextNode(a + chemName + b));
        newItem.setAttribute("class", "chem_item");
        sideList.appendChild(newItem);
    }
}

function reset() {
    reactantArr = {};
    productArr = {};
    update("reactant");
    update("product");
}

function add() {
    try {
        var chemName = document.getElementById("chem_names").value;
        var amount = Number(document.getElementById("amount").value);
        var state = document.querySelector('input[name="state"]:checked').value;
        var side = document.querySelector('input[name="side"]:checked').value;
    } catch (e) {
        if (e.name == "TypeError") {
            alert("Please fill in all fields to add an element!");
        }
        return;
    }
    if (side == "reactant") {
        if (chemNameArr.includes(chemName)) {
            if (Object.keys(reactantArr).includes(chemName)) {
                if (reactantArr[chemName][1] == state) {
                    reactantArr[chemName][0] += amount;
                } else {
                    reactantArr[chemName] = [amount, state];
                }
            } else {
                reactantArr[chemName] = [amount, state];
            }
            update(side);
        }
    }
    else if (side == "product") {
        if (chemNameArr.includes(chemName)) {
            if (Object.keys(productArr).includes(chemName)) {
                if (productArr[chemName][1] == state) {
                    productArr[chemName][0] += amount;
                } else {
                    productArr[chemName] = [amount, state];
                }
            } else {
                productArr[chemName] = [amount, state];
            }
            update(side);
        }
    }
}

function search() {
    try {
        let a = reactantArr.length;
        let b = productArr.length;
    } catch {
        window.location.href = "mainpage.html";
    }

    var numberList = [];
    for (let i=0, l=Object.keys(data).length; i<l; i++) {
        var reactBList = [];
        var productBList = [];
        var eqNumber = Object.keys(data)[i];
        if (Object.keys(data[eqNumber]["reactant"]).length == 0 || Object.keys(data[eqNumber]["product"]).length == 0) {continue;}
        for (var a=0, x=Object.keys(reactantArr).length; a<x; a++) {
            var chemName = Object.keys(reactantArr)[a];

            if (Object.keys(data[eqNumber]["reactant"]).includes(chemName)) {
                amountOk = (parseInt(reactantArr[chemName][0]) == 0 || parseInt(reactantArr[chemName][0]) == parseInt(data[eqNumber]["reactant"][chemName][0]));
                stateOk = (reactantArr[chemName][1] == "ns" || (reactantArr[chemName][1] == "ns" && data[eqNumber]["reactant"][chemName][1] == "ns") || reactantArr[chemName][1] == data[eqNumber]["reactant"][chemName][1]);
                if (amountOk && stateOk) {
                    reactBList.push("t");
                } else {
                    reactBList.push("f")
                }
            } else {
                reactBList.push("f");
            }
        }
        for (let b=0, y=Object.keys(productArr).length; b<y; b++) {
            var chemName = Object.keys(productArr)[b];
            if (Object.keys(data[eqNumber]["product"]).includes(chemName)) {
                amountOk = (parseInt(productArr[chemName][0]) == 0 || parseInt(productArr[chemName][0]) == parseInt(data[eqNumber]["product"][chemName][0]));
                stateOk = (productArr[chemName][1] == "ns" || (productArr[chemName][1] == "ns" && data[eqNumber]["product"][chemName][1] == "ns") || productArr[chemName][1] == data[eqNumber]["product"][chemName][1]);
                if (amountOk && stateOk) {
                    productBList.push("t");
                } else {
                    productBList.push("f");
                }
            } else {
                productBList.push("f");
            }
        }
        if (!(reactBList.includes("f")) && !(productBList.includes("f"))) {
            numberList.push(eqNumber);
        }
    }
    
    var resultList = document.getElementById("result_list");
    while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
    }
    if (numberList.length != 0) {
        for (let i=0, l=numberList.length; i<l; i++) {
            var newItem = document.createElement("li");
            var eqNumber = numberList[i];
            var str = stringify(data[eqNumber]["reactant"], data[eqNumber]["product"])
            newItem.appendChild(document.createTextNode(str));
            newItem.setAttribute("class", "result_item");
            newItem.setAttribute("value", parseInt(eqNumber));
            newItem.setAttribute("onclick", 'openPopup(' + eqNumber + ')')
            resultList.appendChild(newItem);
        }
    } else {
        var newItem = document.createElement("li");
        newItem.appendChild(document.createTextNode("No results found."));
        newItem.setAttribute("class", "result_item");
        resultList.appendChild(newItem);
    }
}

function openPopup(number) {
    var popup = document.getElementById("popup");
    popup.style.display = "flex";
    document.documentElement.scrollTop = 0;
    
    var content = document.getElementById("popup-content");
    
    
    if (data[number]["more"] == "") {
        content.innerHTML = "<h1>No info.</h1><br><button type=\"button\" id=\"close_popup_btn\" onclick=closePopup()>Close!</button>";
    } else {
        content.innerHTML = data[number]["more"];
    }
}

function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}