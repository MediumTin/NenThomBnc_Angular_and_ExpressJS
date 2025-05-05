var Result_Of_Type = "", Result_Of_Group = "", Result_Of_Brand = "", Result_Of_Price = "", Result_Of_Color = "";
                const Check_Header_Request_From_Server = (header_request) =>{
                    // Use cookies for diferentiate HTML pages, NOT GOOD, dont exact use cases of Cookies
                    // Improvement point
                    //var cookie_Value = (document.cookie);
                    //var split_cookie = cookie_Value.split("=");
                    //var LOC_id_cookie_from_server = split_cookie[1];
                    //var LOC_Requet_Cookie = LOC_id_cookie_from_server;
                    var LOC_header_request = header_request;
                    return LOC_header_request;
                }
                
                function expire_time()
                {
                    // console.log(`Cookie is ${document.cookie}`);
                  
                }

                function Load_All_Products() {
                    id_cookie_from_server = "candles";
                    var TotalLengh = 0; // default value
                    var TotalRow = 0; // default value
                    var TotalColum = 4; // fixed value
                    var RedundantRow = 0; // default value for 
                    var ActualRow = 0;
                    var receivedMessage = "";
                    // document.getElementById("demo").innerHTML = "Changed"; 
                    
                    console.log("passed");
                    // var id_cookie_from_server =  Check_Header_Request_From_Server();
                    console.log(`Cookie is ${id_cookie_from_server}`);
                    const xhttp = new XMLHttpRequest();     // AJAX technique : use to get/post data via HTML page without loading website
                    // xhttp.onload = function() {
                    //     document.getElementById("demo").innerHTML =
                    //     this.responseText;
                    // }
                    expire_time();
                    // xhttp.open("POST", "/candles");
                    xhttp.open("POST", `/${id_cookie_from_server}`);
                    xhttp.setRequestHeader( 
                    "Content-Type", "application/json" 
                    ); 
                    var data = JSON.stringify( 
                        { name: "First_Time_load", email: "abcdef" } 
                    ); 
                    xhttp.send(data);
                    // Create a state change callback 
                    xhttp.onreadystatechange = function () { 
                        if (xhttp.readyState === 4 && 
                            xhttp.status === 200) { 
                            receivedMessage = this.responseText;
                            console.log(`Lenght of received info : ${typeof(receivedMessage)}`);
                            receivedMessage = JSON.parse(receivedMessage);
                            var temp = 0;
                            let stringtemp = "";
                            let myarray = "";
                            const tablemenu = document.querySelector("#table_menu");
                            // console.log(`Lenght of received info : ${receivedMessage}`);
                            TotalLengh = receivedMessage.length;
                            console.log(`TotalLengh of received info : ${TotalLengh}`);
                            TotalRow = TotalLengh/TotalColum;
                            RedundantRow = TotalLengh%TotalColum;
                            // console.log(`Lenght of received info : ${RedundantRow}`);
                            if (RedundantRow == 0){
                                ActualRow = TotalRow;
                            }
                            else {
                                ActualRow = TotalRow + 1;
                            }
                            for(var row = 1;row<=ActualRow;row++){
                                tablemenu.innerHTML += `<tr id="row${row}"></tr>`;
                                const fruitsList = document.querySelector(`#row${row}`);
                                if(RedundantRow != 0 && row == ActualRow){
                                    // odd case, last row (redundant row)
                                    for(var col = 1;col<=RedundantRow;col++){
                                        stringtemp = `${receivedMessage[temp].name}`;
                                        myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                                        fruitsList.innerHTML += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${receivedMessage[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${receivedMessage[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${receivedMessage[temp].price}</p></a></th>`;
                                        temp = temp + 1;
                                    }
                                }
                                else {
                                    // Normal case , no odd length
                                    for(var col = 1;col<=TotalColum;col++){
                                        stringtemp = `${receivedMessage[temp].name}`;
                                        myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                                        fruitsList.innerHTML += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${receivedMessage[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${receivedMessage[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${receivedMessage[temp].price}</p></a></th>`;
                                        temp = temp + 1;
                                    }
                                }
                            }
                        } 
                    }; 
                    
                    
                }

                
                function Filter_Product_From_Server(Result_Of_Type, Result_Of_Group, Result_Of_Brand, Result_Of_Price, Result_Of_Color) {
                    var TotalLengh = 0; // default value
                    var TotalRow = 0; // default value
                    var TotalColum = 4; // fixed value
                    var RedundantRow = 0; // default value for 
                    var ActualRow = 0;
                    var receivedMessage = "";
                    // document.getElementById("demo").innerHTML = "Changed"; 
                    console.log("passed")
                    const xhttp = new XMLHttpRequest();
                    // xhttp.onload = function() {
                    //     document.getElementById("demo").innerHTML =
                    //     this.responseText;
                    // }
                    xhttp.open("POST", "/candles");
                    xhttp.setRequestHeader( 
                    "Content-Type", "application/json" 
                    ); 
                    var data = JSON.stringify( 
                        {   name: "Request_Filter_Product", 
                            Request_Of_Type: `${Result_Of_Type}`, 
                            Request_Of_Group: `${Result_Of_Group}`, 
                            Request_Of_Brand: `${Result_Of_Brand}`, 
                            Request_Of_Price: `${Result_Of_Price}`, 
                            Request_Of_Color: `${Result_Of_Color}` 
                    } 
                    ); 
                    xhttp.send(data);
                    // Create a state change callback 
                    xhttp.onreadystatechange = function () { 
                        if (xhttp.readyState === 4 && 
                            xhttp.status === 200) { 
                            receivedMessage = this.responseText;
                            receivedMessage = JSON.parse(receivedMessage);
                            var temp = 0;
                            let stringtemp = "";
                            let myarray = "";
                            const tablemenu = document.querySelector("#table_menu");
                            // console.log(`Lenght of received info : ${receivedMessage.length}`);
                            TotalLengh = receivedMessage.length;
                            TotalRow = TotalLengh/TotalColum;
                            RedundantRow = TotalLengh%TotalColum;
                            // console.log(`Lenght of received info : ${RedundantRow}`);
                            if (RedundantRow == 0){
                                ActualRow = TotalRow;
                            }
                            else {
                                ActualRow = TotalRow + 1;
                            }
                            for(var row = 1;row<=ActualRow;row++){
                                tablemenu.innerHTML += `<tr id="row${row}"></tr>`;
                                const fruitsList = document.querySelector(`#row${row}`);
                                if(RedundantRow != 0 && row == ActualRow){
                                    // odd case, last row (redundant row)
                                    for(var col = 1;col<=RedundantRow;col++){
                                        stringtemp = `${receivedMessage[temp].name}`;
                                        myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                                        fruitsList.innerHTML += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${receivedMessage[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${receivedMessage[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${receivedMessage[temp].price}</p></a></th>`;
                                        temp = temp + 1;
                                    }
                                }
                                else {
                                    // Normal case , no odd length
                                    for(var col = 1;col<=TotalColum;col++){
                                        stringtemp = `${receivedMessage[temp].name}`;
                                        myarray = stringtemp.replaceAll(" ","_"); // replace all space in string with underscore
                                        fruitsList.innerHTML += `<th><a id="RouteIDA13" href="${"/candle_information/" + myarray}" style="text-decoration: none; color: black;"><img id="DisplayImageA13" src=${receivedMessage[temp].image} width="200" height="200"><p id="DisplayNameA13" style="font-size: 20px;">${receivedMessage[temp].name}</p><p id="DisplayPriceA13" style="font-size: 20px;">${receivedMessage[temp].price}</p></a></th>`;
                                        temp = temp + 1;
                                    }
                                }
                            }
                        } 
                    }; 
                    // setTimeout(Load_All_Products, 1000); 
                    
                }

                function ClearAvailableTable(){
                    const tablemenu = document.getElementById("table_menu");
                    tablemenu.textContent = "";
                }  

                const set_Button_Initial_Value = (Request_Header) => {
                    var LOC_Result = 0;
                    switch (Request_Header) {
                        case "candles":
                            // code block
                            document.getElementById("candle").checked = true;
                            document.getElementById("oil").checked = false;
                            document.getElementById("accessory").checked = false;
                            document.getElementById("gift").checked = false;
                            LOC_Result = 1;
                            break;
                        case "oils":
                            // code block
                            document.getElementById("candle").checked = false;
                            document.getElementById("oil").checked = true;
                            document.getElementById("accessory").checked = false;
                            document.getElementById("gift").checked = false;
                            LOC_Result = 1;
                            break;
                        case "accessories":
                            // code block
                            document.getElementById("candle").checked = false;
                            document.getElementById("oil").checked = false;
                            document.getElementById("accessory").checked = true;
                            document.getElementById("gift").checked = false;
                            LOC_Result = 1;
                            break;
                        case "gifts":
                            // code block
                            document.getElementById("candle").checked = false;
                            document.getElementById("oil").checked = false;
                            document.getElementById("accessory").checked = false;
                            document.getElementById("gift").checked = true;
                            LOC_Result = 1;
                            break;
                        default:
                            //code block default : all products (only diffuse oils, natural oils, burn candles, care candles) - will be triggered later by event
                            document.getElementById("candle").checked = false;
                            document.getElementById("oil").checked = false;
                            document.getElementById("accessory").checked = false;
                            document.getElementById("gift").checked = false;
                            LOC_Result = 0;
                    }
                    return LOC_Result;
                }

                // Function: ButtonCheck called by event
                function ButtonCheck(){
                    ClearAvailableTable();
                    var Number_Of_A = 0, Number_Of_B = 0, Number_Of_C = 0, Number_Of_D = 0, Number_Of_E = 0;
                    var Filter_Of_A= [], Filter_Of_B= [], Filter_Of_C= [], Filter_Of_D= [], Filter_Of_E= [];

                    var A = [
                        (document.getElementById("candle").checked) ? "candle":"", // A1
                        (document.getElementById("oil").checked) ? "oil":"", // A2
                        (document.getElementById("accessory").checked) ? "accessory":"", // A3
                        (document.getElementById("gift").checked) ? "gift":"" // A4
                    ]
                    var B =[
                        (document.getElementById("best_saler").checked)?"best_seller":"", //B1
                        (document.getElementById("discount").checked)?"discount":"", // B2
                        (document.getElementById("new_arrival").checked)?"new_arrival":"", // B3
                        (document.getElementById("sweet_fruit").checked)?"sweet_fruit":"", // B4
                        (document.getElementById("wood_men").checked)?"wood_men":"", // B5
                        (document.getElementById("fresh_relax").checked)?"fresh_relax":"", // B6
                        (document.getElementById("flower_herb").checked)?"flower_herb":"" // B7
                    ]
                    var C = [
                        (document.getElementById("lumos").checked)?"lumos":"", // C1
                        (document.getElementById("citta").checked)?"citta":"", // C2
                        (document.getElementById("no_brand").checked)?"no_brand":"" // C3
                    ]
                    var D = [
                        (document.getElementById("smaller_100KVND").checked)?"smaller_100KVND":"", // D1
                        (document.getElementById("100KVND_to_200KVND").checked)?"100KVND_to_200KVND":"", // D2
                        (document.getElementById("200KVND_to_300KVND").checked)?"200KVND_to_300KVND":"", // D3
                        (document.getElementById("300KVND_to_500KVND").checked)?"300KVND_to_500KVND":"", // D4
                        (document.getElementById("larger_500KVND").checked)?"larger_500KVND":"" // D5

                    ]
                    var E = [
                        (document.getElementById("black").checked)?"black":"", // E1
                        (document.getElementById("white").checked)?"white":"", // E2
                        (document.getElementById("red").checked)?"red":"", // E3
                        (document.getElementById("pink").checked)?"pink":"", // E4
                        (document.getElementById("blue").checked)?"blue":"", // E5
                        (document.getElementById("green").checked)?"green":"", // E6
                        (document.getElementById("yellow").checked)?"yellow":"", // E7
                        (document.getElementById("orange").checked)?"orange":"", // E8
                        (document.getElementById("purple").checked)?"purple":"" // E9
                    ]
                    for(let i = 0; i<4;i++){
                        if(A[i] != ""){
                            Filter_Of_A[Number_Of_A] = A[i];   
                            Number_Of_A++;
                        }
                        // console.log(`Result of A${i+1} is`,A[i]);
                    }
                    if(Number_Of_A != 0){
                        Result_Of_Type = Filter_Of_A;
                    }
                    else {
                        // Result_Of_Type = "A1 || A2 || A3 || A4";
                        Result_Of_Type = ["candle","oil","accessory","gift"];
                        // Result_Of_Type = ["A1","A2","A3","A4"];
                    }
                    console.log("Result of A",Result_Of_Type);

                    for(let i = 0; i<7;i++){
                        if(B[i] != ""){
                            Filter_Of_B[Number_Of_B] = B[i];   
                            Number_Of_B++;
                        }
                        // console.log(`Result of B${i+1} is`,B[i]);
                    }
                    if (Number_Of_B !=0){
                        Result_Of_Group = Filter_Of_B;
                    }
                    else {
                        Result_Of_Group = ["best_seller","discount","new_arrival","sweet_fruit","wood_men","fresh_relax","flower_herb"];
                        // Result_Of_Group = "B1 || B2 || B3 || B4 || B5 || B6 || B7";
                    }
                    console.log("Result of B",Result_Of_Group);
                    for(let i = 0; i<3;i++){
                        if(C[i] != ""){
                            Filter_Of_C[Number_Of_C] = C[i];   
                            Number_Of_C++;
                        }
                        // console.log(`Result of C${i+1} is`,C[i]);
                    }
                    if (Number_Of_C !=0){
                        Result_Of_Brand = Filter_Of_C;
                    } 
                    else {
                        Result_Of_Brand = ["lumos","citta","no_brand"];
                        // Result_Of_Brand = "C1 || C2 || C3";
                    }

                    for(let i = 0; i<5;i++){
                        if(D[i] != ""){
                            Filter_Of_D[Number_Of_D] = D[i];   
                            Number_Of_D++;
                        }
                        // console.log(`Result of D${i+1} is`,D[i]);
                    }
                    if (Number_Of_D !=0){
                        Result_Of_Price = Filter_Of_D;
                    } 
                    else {
                        Result_Of_Price = ["smaller_100KVND","100KVND_to_200KVND","200KVND_to_300KVND","300KVND_to_500KVND","larger_500KVND"];
                        // Result_Of_Price = "D1 || D2 || D3 || D4 || D5";
                    }

                    for(let i = 0; i<9;i++){
                        if(E[i] != ""){
                            Filter_Of_E[Number_Of_E] = E[i];   
                            Number_Of_E++;
                        }
                        // console.log(`Result of E${i+1} is`,E[i]);
                    }
                    if (Number_Of_E != 0){
                        Result_Of_Color = Filter_Of_E;
                    } 
                    else {
                        Result_Of_Color = ["black","white","red","pink","blue","green","yellow","orange","purple"];
                        // Result_Of_Color = "E1 || E2 || E3 || E4 || E5 || E6 || E7";
                    } 
                    
                    console.log(`A = ${Result_Of_Type}`);
                    console.log(`B = ${Result_Of_Group}`);
                    console.log(`C = ${Result_Of_Brand}`);
                    console.log(`D = ${Result_Of_Price}`);
                    console.log(`E = ${Result_Of_Color}`);
                    Filter_Product_From_Server(Result_Of_Type,Result_Of_Group,Result_Of_Brand,Result_Of_Price,Result_Of_Color);
                }
                
                // Initial task
                function Init_task(){
                    const Request_From_Header = document.getElementById('RequestHeader').innerHTML;
                    console.log(`Request file from server is: ${Request_From_Header}`);
                    var Request_Header = Check_Header_Request_From_Server(Request_From_Header); // Check cookie to indentify specific request
                    console.log(`Cookie is ${Request_Header}`);
                    var result_Button_Checking = set_Button_Initial_Value(Request_Header); // check properties of this filter firstly
                    if(result_Button_Checking){
                        ButtonCheck();
                    } else {
                        Load_All_Products(); // Load all product for some general request: Diffuse oils, natural oils, Burn candles, Care candles
                    }
                }
                Init_task(); // Process init task