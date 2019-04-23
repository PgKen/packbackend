let s_idSeller = '';
let s_idMenu = ''

function selectMenu(id, idsub) {
    //let pradri = __dirname
    switch (id) {
        case 0:
            loadHome();
            break;
        case 1:
            //loadSeller();
            window.location.href = "/seller"
            break;
        case 2:
            loadFromRec();
            window.location.href = "/recSeller"
            break;
        case 3:
            // window.location('./')
            window.location.href = "/"
            break;
        case 4:
            // window.location('./')
            window.location.href = "/rec/" + idsub
            break;
        case 5:
            // window.location('./')
            window.location.href = "/stock/"
            break;
        case 6:
            // window.location('./')
            window.location.href = "/setting/"
            break;
        case 10:
            // window.location('./')
            window.location.href = "/Do/"
            break;

        default:
            //loadHome();
            break;
    }
}

function selectRec(id) {
    //alert("test")
    window.location.href = "./rec/" + id
}

function loadFromRec() {
    console.log("FromRec");
    $.ajax({
        type: "GET",
        url: "http://localhost:3800/seller",
        //data: "data",
        dataType: "json",
        success: function (res) {
            //console.log(res)
            let txt = "<div class = 'boxTitleName'> ::: รับสินค้า ::: </div><div class = 'boxSeller'>"

            for (let i = 0; i < res.length; i++) {
                txt += "<ul class='listSeller'>"
                txt += "<li>" + res[i].code_seller + "</li>"
                txt += "<li>" + res[i].name_seller + "</li>"
                txt += "<li>" + res[i].address_seller + "</li>"
                txt += "<li>" + res[i].mobile_seller + "</li>"
                txt += "<li>" + res[i].fax_seller + "</li>"
                txt += "</ul>"
            }
            txt += "</div>"
            //console.log(txt)
            document.getElementById('getData').innerHTML = txt
        }
    })

}

function nextRec(id) {
    s_idSeller = id
    console.log("Rec" + s_idSeller);


    document.getElementById('getData').innerHTML = "REC" + id


}

function loadSeller() {
    console.log("seller");
    $.ajax({
        type: "GET",
        url: "http://localhost:3800/seller",
        //data: "data",
        dataType: "json",
        success: function (res) {
            //console.log(res)
            let txt = "<div class = 'boxTitleName'> ::: ผู้ ขาย::: </div><div class = 'boxSeller'>"

            for (let i = 0; i < res.length; i++) {
                txt += "<ul class='listSeller'>"
                txt += "<li>" + res[i].code_seller + "</li>"
                txt += "<li>" + res[i].name_seller + "</li>"
                txt += "<li>" + res[i].address_seller + "</li>"
                txt += "<li>" + res[i].mobile_seller + "</li>"
                txt += "<li>" + res[i].fax_seller + "</li>"
                txt += "</ul>"
            }
            txt += "</div>"
            //console.log(txt)
            document.getElementById('getData').innerHTML = txt
        }
    })
}

function loadHome() {
    document.getElementById('getData').innerHTML = "Loading...."
    setTimeout(() => {
        document.getElementById('getData').innerHTML = ""
        console.log("home");
    }, 2000);

}