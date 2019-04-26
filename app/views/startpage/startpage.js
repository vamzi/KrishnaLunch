var Observable = require("tns-core-modules/data/observable").Observable;
const page = require("tns-core-modules/ui/page").Page;
const httpModule = require("http");
var utilityModule = require("utils/utils");
var utilsModule = require("tns-core-modules/utils/utils");
const fromObject = require("tns-core-modules/data/observable").fromObject;
const modalViewModule = "ns-ui-category/modal-view/basics/modal-view-page";
var application = require("tns-core-modules/application");
require("nativescript-dom");
var fileName = application.getCssFileName();
var pageno=0;

console.log(`fileName ${fileName}`);
let viewModel = new Observable();
viewModel.set("menu", [])
var data=[];
var qty=1;
var price=6;
var days=['Monday','Tuesday','Wednesday','Thursday','Friday'];
var selectedIndex=3;
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function onPageLoaded(args) {
    viewModel.set("pageno", pageno);
    var page = args.object;
    page.actionBarHidden = true;
    console.log("Loading JSON");
    viewModel.set("activstate",true);
    viewModel.set('visstat','visible');
    fetch('https://raw.githubusercontent.com/kkumar1994/KrishnaLunch/master/sample.json')
    .then((response) => response.json())
    .then((res) => {
        
       for(var i=0;i<5;i++)
       data.push({"days":days[i],"item1":res['items'][i][1],"item2":res['items'][i][2],"item3":res['items'][i][3],"item4":res['items'][i][4]});
       viewModel.set("menu", []);
       viewModel.set("pickup-list",[]);
       viewModel.set("menu", data);
       viewModel.set("week",res['week']);
        qty=1;
        price=6;
        viewModel.set("pickuplist",res['pickup']);
       viewModel.set("qty",qty);
       viewModel.set("price",price);
       viewModel.set("selectedIndex",selectedIndex);
       viewModel.set("activstate",false);
       viewModel.set('visstat','collapsed');
     
    }).catch((err) => {
        viewModel.set("activstate",false);
        viewModel.set('visstat','collapsed');
        var dialogs = require("tns-core-modules/ui/dialogs");
            dialogs.alert({
                title: "No Internet!",
                message: "Please check your internet connection",
                okButtonText: "OK"
            }).then(function () {
                android.os.Process.killProcess(android.os.Process.myPid());
            });
            console.log(err);
            });

page.bindingContext = viewModel;

}
exports.onPageLoaded = onPageLoaded;



function increment(args){
    if(qty < 8)
    qty++;
    var price = 6 * qty;
    viewModel.set("price",price);
    viewModel.set("qty",qty);
    
}

function decrement(args){
    if(qty > 1)
    qty--;
    var price = 6 * qty;
    viewModel.set("price",price);
    viewModel.set("qty",qty);
}

exports.increment = increment;
exports.decrement = decrement;


exports.launchPay = function() {
    viewModel.set("htmlString","");
    selectedIndex =  viewModel.get("selectedIndex");
    if(qty==1) {
        qty = qty + "%20Box";
    }else if(qty=="Weekly KL"){
        qty = "Weekly%20KL";
    }else if(qty=="Monthly KL"){
        qty = "Monthly%20KL";
    }else{
        qty = qty + "%20Boxes";
    }
    var pickuplist = viewModel.get("pickuplist");
    var lock = pickuplist[selectedIndex];
    var loc = String(lock); 
    loc = loc.replaceAll(' ','%20');


   var webUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DJWVKLTR7332J&on0=Quantity&os0="+qty+"&on1=Pick-up%20Locations&os1="+loc;
   utilityModule.openUrl(webUrl);
}

exports.launchPayMon = function() {
    viewModel.set("htmlString","");
    selectedIndex =  viewModel.get("selectedIndex");
    var pickuplist = viewModel.get("pickuplist");
    var lock = pickuplist[selectedIndex];
    var loc = String(lock); 
    loc = loc.replace(' ','%20');
   var webUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DJWVKLTR7332J&on0=Quantity&os0=Monthly%20KL&on1=Pick-up%20Locations&os1="+loc;
   utilityModule.openUrl(webUrl);
}

exports.launchPayWeek = function() {
    viewModel.set("htmlString","");
    selectedIndex =  viewModel.get("selectedIndex");
    var pickuplist = viewModel.get("pickuplist");
    var lock = pickuplist[selectedIndex];
    var loc = String(lock); 
    loc = loc.replace(' ','%20');
   var webUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DJWVKLTR7332J&on0=Quantity&os0=Weekly%20KL&on1=Pick-up%20Locations&os1="+loc;
   utilityModule.openUrl(webUrl);
}

exports.next= function() {
    pageno=viewModel.get("pageno");
    pageno=pageno+1;
    if(pageno>=5){
        pageno=pageno%5;
    }
    viewModel.set("pageno", pageno);
}

exports.prev= function() {
    pageno=viewModel.get("pageno");
    if(pageno>0)
    pageno=pageno-1;
    if(pageno>=5){
        pageno=pageno%5;
    }
    viewModel.set("pageno", pageno);
}