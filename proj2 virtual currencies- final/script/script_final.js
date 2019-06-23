
$(document).ready(function(){

    /* *** *** INITIALIZATION VARIABLES *** *** *** *** *** *** */
    const url1 = 'https://api.coingecko.com/api/v3/coins/list';
    let last_evnt_timeStamp = new Date(); // (used for togel btn)

    let all_coins_arr = []; // array of ALL coines from server1(api.coingecko.com). each coin symbol is an object 
    let all_coins_symbl_list = "'all_coins_arr' is empty";//list of the abov array
    let coins_with_data_arr = []; // array of ALL coines from server2(min-api.cryptocompare.com). each coin id is an object
    let to_reprts_arr = []; // array of id's of coines to be included in 'Reports' mode

    let arr5coins_clos_histry = []; // 'closing prices' of the 5 coines in 'Reports mode'.(array of arrays) 
    let arr5coins_time_histry = []; // a matching date for each 'closing price'.(array of arrays) 

    let v_coins_btn = document.querySelector("#coins_btn"); // 
        v_coins_btn.addEventListener("click",coins_func);
    let v_reprts_btn = document.querySelector("#reprts_btn"); // 
        v_reprts_btn.addEventListener("click",reprts_func);
    let v_abot_btn = document.querySelector('#abot_btn'); // 
        v_abot_btn.addEventListener('click',abot_func);

    let v_serch_inpt = document.getElementById('serch_inpt'); // 
        document.getElementById('serch_inpt').focus();
        document.getElementById('serch_inpt').style.boxShadow =" 0 6px rgb(30, 30, 30)";
    let serch_inpt_2 = document.getElementById('serch_inpt');
        to_complete = new Awesomplete(serch_inpt_2);// using Awesomplete(autocomplete widget)
        to_complete.list = all_coins_arr;   
    let v_serch_btn = document.getElementById('serch_btn'); // 
        v_serch_btn.addEventListener('click',serch_func);

    let v_coins_div = document.getElementById("coins_div"); // COINS
        v_coins_div.style.top = "140px";
    let v_reprts_div = document.getElementById('reprts_div'); // REPORTS
        v_coins_div.style.top = "140px";
    let v_about_div = document.getElementById('about_div'); // ABOUT
        v_coins_div.style.top = "140px";

    let disply_card = true;
    let disply_genrl_card= false;
    let disply_recnt_card = false;

    let modal_evnt = false; // flag
    let card_marked = false; // flag if certain coin is/isnt included in 'reports'

    let v_side_div1 = document.getElementById('side_div1'); // part of "reports view"
    let v_side_div2 = document.getElementById('side_div2'); // part of "reports view"
    /* *** END INITIALIZATION VARIABLES *** ***  *** *** ***  */

    /* *** *** INITIALIZATION ACTIONS  *** *** *** *** *** *** *** *** */
    fetch_all_coins(url1); //  fetch and display ALL COINES
    fetch_list_4reports(); // prapare coins list of all coines that can be included in 'reports'
    coins_func(); 

    /* *** *** ALL COINES LOOK *** *** */
    function coins_func() {
        // console.log("coins_func begin");
        v_coins_div.style.display = "flex";
        v_reprts_div.style.display = "none";
        v_about_div.style.display = "none";
        
    // /* <<<<<<< returning the veiw of "all coins" after visining reports <<<<<<<<<<<<<<<<<<<<<<<<<< */
    let show_rg_crd = $(".card_chosed "); // show_rg_crd: show regular card
    for (i = 0; i < show_rg_crd.length; i++) { // show_rg_crd: a node of choosed cards
        show_rg_crd[i].children[0].style.display = "flex"; // card
        //show_rg_crd[i].children[1].style.display = "none"; // genrl_card
        }    
    // /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    } // coins_func close

    /* *** *** SEARCH BUTTON+INPUT COMBIND ********************** *** */
    function serch_func() {
        // console.log("serch btn clicked");
        let coin2find = document.getElementById('serch_inpt').value;
        let no_matches = true;
         for (i=0;i<all_coins_arr.length;i++){
            if (all_coins_arr[i] === coin2find) {
                no_matches = false;
                card[i].scrollTo() // element.scrollTo()
                card[i].children[4].focus();//recnt_info_btn
                card[i].style.border = "12px solid yellow";
            break;
            } //   if close  
        } // for close   
        if (no_matches) {
            alert(coin2find+": \n is NOT a known Symbol Code for a Crypto Currency." + "\n" +"Please Correct The Search Symbol!")
            v_serch_inpt.focus();
        }
    } // serch_func close
   /* *** *** END SEARCH ***************************************** *** */

    /* *** *** fetch server1: (URL) **************************** *** */
    function fetch_all_coins(url){
        console.log("ver 34");

    fetch(url) 
        .then((response) => {// response is: data from server (in form of string brfore JSON parse)
            return response.json();// 1.JSON.parse the response and moove it to the next 'then'
        }) // '.then1' close
        .then((data_from_api) => { 
            let i = 0;
            // while (data_from_api[i]) {
            while (i<888) {
                all_coins_arr[i] = data_from_api[i].symbol.toUpperCase();
                make_card(data_from_api[i]);
                i++;
            } // while close
         all_coins_symbl_list = all_coins_arr.toString(); // a list to be used in autocomplit awsomelpete

        }); // '.then2' close
     console.log(all_coins_arr); // here 'all_coins_arr' is NOT OK! is presented on console.log before the 'then' loaded the  fetched data into it
    }; // 'fetch_all_coins()' close 
    /* *** *** END fetch (URL) ********************************************** *** */


    /* @@@ @@@@@@@@@@@@  MAKE CARD  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ @@@ */
    /* 
    card contnr: The DOM Elemnt of a coin contain 3 "children":
        1.Card: coin DOM element.
        2.Recent Info 'card' (created upon user 'click')
        3.Generl Info 'card' (created upon user 'click')
    */
   // a_coin: the data of coin was fetched from the server1 API(coingecko.com)
   //  function 'make_card': dinamicly create a card for each single coin and append it to 'coins_div' 

   function make_card(a_coin){
        let card_contnr = document.createElement("div"); //'card_contnr' container to 2 card modes
            card_contnr.id = "card_contnr";
            v_coins_div.appendChild(card_contnr); // pin any card_contnr on the page_content

        let card = document.createElement("div"); 
            card.id = "card";
            card_contnr.appendChild(card); // // make card to be 1'st child of 'card container' 

        /*** card_contnr + card STYLE / class ***/
        card_contnr.className = "well card_tmplt"; // well:bootstrap class
        card.className = "well card_tmplt"; //

        /* *** ***  CARD VARIABLES *** *** *** *** *** *** */
        let card_id = document.createElement("p");
            card_id.id = "card_id";
        let card_txt_symbl = document.createElement("p");
            card_txt_symbl.id = "card_txt_symbl";
        let card_name = document.createElement("p");
            card_name.id = "card_name"; 

        let crd_fetch_info_time = document.createElement("p");  
            crd_fetch_info_time.id ="crd_fetch_info_time"

        let togl_btn = document.createElement("button");
            togl_btn.id = "togl_btn";
            togl_btn.value = "off";
            togl_btn.innerHTML= '<label ></lable><input type="checkbox" unchecked class="switch_input TOGGLE" ><span class="slider"></span> '
            togl_btn.children[0].style.width= 0; // try to del <label>the small squar

        let recnt_info_btn = document.createElement("button");// recnt_info_btn: 'Recent Info' Button
            recnt_info_btn.id = "recnt_info_btn"; 
            recnt_info_btn.className = "push_btn smal_push_btn"; 
            recnt_info_btn.style.left = "1px";
            recnt_info_btn.innerText = "Recent Info"; 

        let genrl_info_btn = document.createElement("button");// genrl_info: General Info
            genrl_info_btn.id = "genrl_info_btn"; 
            genrl_info_btn.className = "push_btn smal_push_btn"; 
            genrl_info_btn.style.right = "1px";
            genrl_info_btn.innerText = "General Info"; 

        let stamp = document.createElement("div");
            stamp.id = "stamp";
            stamp.style.visibility = "hidden";

        /*** inject card values ***/ /*inject coin values to card variables*/ 
        card_id.innerText = a_coin.id;
        card_txt_symbl.innerText = a_coin.symbol.toUpperCase();
        card_name.innerText = a_coin.name;
        crd_fetch_info_time.value= false; // a var to store the creation time of the tmporary card which present the 'MoreInfo' data 
        stamp.innerHTML = ""; 

        /* Appending "card"(of each coin) children*/
        card.appendChild(card_id);  // child No 0
        card.appendChild(card_txt_symbl);    // child No 1
        card.appendChild(card_name);  // child No 2
        card.appendChild(togl_btn);  // child No 3 
        card.appendChild(recnt_info_btn);  // child No 4
        card.appendChild(genrl_info_btn);  // child No 5
        card.appendChild(crd_fetch_info_time);  // child No 6!
        card.appendChild(stamp); // child No 7! last 

        /* *** ***  CARD EVENTS *** *** *** *** *** *** */
        card.addEventListener("mouseover",  
            function() { card.style.borderWidth = "3px";} 
        );
        card.addEventListener("mouseout", 
            function() {card.style.borderWidth= "0" ;}
        );

        /**************** toggle-switch EVENTS  ********************************************/
        // The togl_btn: switched by the user to includ this coin in 'REPORTS'
        togl_btn.addEventListener("click", togl_btn_clicked );

        function togl_btn_clicked(evnt){
            let coin_id = togl_btn.parentElement.children[1].innerText;// children[1] card

            if (!coin_have_data(coin_id)) { // change the togl btn color to gray
                togl_btn.innerHTML= '<label ></lable><input type="checkbox" unchecked class="switch_input TOGGLE"><span class="slider" style="background-color: gray;" ></span> '
                }
            else {
                modal_evnt = false;// 
                check_on_off (evnt)
        }
        function check_on_off (evnt) {
           // Toggle button cause 2 "click" events
           // because the 'toggle' exist together with the 'checkbox' and they react(click/UNclik) simultaniusly
           // the 'if()' blocks the 2'nd click execution 
            if (evnt.timeStamp !== last_evnt_timeStamp) { 
                last_evnt_timeStamp = evnt.timeStamp;
                //console.log('"TOGGLE btn"- clicked');

               if (!modal_evnt) { let coin_id = togl_btn.parentElement.children[1].innerText;}
                        else    { let coin_id = evnt.parentElement.parentElement.firstChild.innerText;}

                if (togl_btn.value === "off") {
                    togl_btn.value = "on";
                    togl_btn.parentElement.parentElement.classList.add("card_chosed");
                    card_marked = true;
                    put_stamp();// "to_reprts"(stamp) displayed on card
                    add2reprts_list(coin_id);
                    // /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                    // var all = $(".card_chosed ").map(function() { //make a long string of HTML of all choosed cards
                    //     return this.innerHTML;
                    // }).get();
                    // console.log(all.join());
                    // /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
                }
                else{
                    togl_btn.value = "off";
                    card_marked = false;
                    togl_btn.parentElement.classList.remove("card_chosed");
                    del_from_reprts_list(coin_id);
                    remov_stamp();
                }
            }// 'if click.timeStamp != ...' close
        } // func. 'check_on_off' close
        } // togl_btn_clicked close

        function put_stamp(){ // A stamp "to_reports"on card
            stamp.innerHTML = "ON<br>REPORTS"; 
            stamp.style.visibility = "visible";
            stamp.className = "stamping";
        }
        function remov_stamp(){
            stamp.innerHTML = "Removed ! "; 
            stamp.className = "fade_out";
        }

        function add2reprts_list (coin_id) { 
                to_reprts_arr.push(coin_id); 
                if(to_reprts_arr.length >5) { modal_popup_func(); }
        } // func add2reprts_list close

        function del_from_reprts_list(coin_id) { 
            for (i=0; i< to_reprts_arr.length ; i++){
                if (to_reprts_arr[i] === coin_id){
                    to_reprts_arr.splice(i , 1);
                    arr5coins_time_histry.splice(i , 1);
                    arr5coins_clos_histry.splice(i , 1);
                }
            }
            card.lastChild.innerHTML = "Removed ! "; 
            card.lastChild.className = "fade_out";
          } // func del_from_reprts_list close


       /* #################################  ON CARD BUTTONS AND ACTIONS  ###################################### */
        /**************** General Info btn *************************/
        /* The "genrl_info_btn" events */
       $(genrl_info_btn).click(genrl_info_func );
        function genrl_info_func() { 
            //console.log('"General Info btn"- clicked');
            let gen_coin_id = card.firstChild.innerText;// 
            let gen_fetch_info_time = crd_fetch_info_time.value; 
                disply_card = true;
                disply_genrl_card = true;
                disply_recnt_card = false;
                check_if_need_2_fetch2(gen_fetch_info_time,gen_coin_id);
            }//genrl_info_func close
         /*************END General Info btn *****************************/

         /**************** Recent Info btn *****************************/
         /* The "recnt_info_btn" events */
        $(recnt_info_btn).click(recnt_info_func );
        function recnt_info_func() { 
                //console.log(' "Recent Info func" starts');
            let coin_id = card.firstChild.innerText;// 
            let fetch_info_time = crd_fetch_info_time.value; 
                console.log(fetch_info_time );
                disply_card = false;
                disply_genrl_card = false;
                disply_recnt_card = true;
          check_if_need_2_fetch2(fetch_info_time,coin_id);
        }//recnt_info_func close
         /**************** END Recent Info btn **************************/

        /**************** Check if there is need to fetch and build recnt_card *************************/
        function check_if_need_2_fetch2(fetch_time,coin_id){
            //console.log("start check_if_need_2_fetch2" );

            if (!card_marked &&fetch_time && (new Date()-fetch_time) < 120000){ //checking if 1 AND 2. // 1)is there any recnt_card. 2)the data in the temporary_card was fetched(retrieved) for more than 2 minutes ago(120,000 ms)

                /* *** display the apropriare cards *** */
                if (disply_card)        { card.style.display = "flex";}
                    else                { card.style.display = "none";}

                if (disply_genrl_card)  { card.nextElementSibling.style.display = "flex";} // genrl_card 
                    else                { card.nextElementSibling.style.display = "none";} // genrl_card 

                if (disply_recnt_card)  { card.parentElement.lastChild.style.display = "flex";} //recnt_card
                    else                { card.parentElement.lastChild.style.display = "none";} //recnt_card

            } else if (fetch_time) { // deleting cards 2+3 and Re-fetching;
                card_contnr.lastChild.remove();//delete recnt_card.
                card_contnr.lastChild.remove();//delete genrl_card
                fetch_1_coin_buil2cards(coin_id)
            } else  {//first time fetch &build more 2 sibling cards");
                fetch_1_coin_buil2cards(coin_id)
            }

        }//func.check_if_need_2_fetch2 close
        /**********************************************************/

        /**************** FETCH2     *****************************************/
        function fetch_1_coin_buil2cards(coin_id){

        let url2 = "https://api.coingecko.com/api/v3/coins/"
            url2+=coin_id;
            url2+="?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";

        // fetch(retriev) fresh coin data from API server.
        fetch(url2) 
            .then((response) => {
                return response.json();// 1.JSON.parse the response and moove it to the next 'then'
            }) // '.then1' close
            .then((data2_from_api) => { 
                let time_of_fetch = new Date();
                build2cards(data2_from_api,time_of_fetch);
            }); // '.then2' close
        }; // 'fetch_1_coin_buil2cards()' close 
        /************* END fetch2 *****************************************/

        /*************BUILD 2 CARDS as children of card_contnr & if marked, append them also to reports *****************************/
        // Actions: 1.build 2 cards 2. fetch info from server 3.inject info into cards 4.display the apropriat cards
        // The cards:1.General info card 2.Recent info card
        function build2cards(coin_data,update_time) { // console.log("start build 2 cards");
            let coin_id = card.firstChild.innerText;

            /******* 'General-Info' card + 'Recent-Info' card elements *********/
            let genrl_card  = card.cloneNode(false); //  false-> avoid duplication(cloning) of descendants(children)
                genrl_card.id = "genrl_card" ;       // genrl_card: the card to present the "General Info" 

            let recnt_card  = card.cloneNode(false);  // 
                recnt_card.id = "recnt_card" ;        // card_temp: the card to present the "Recent Info" 
                recnt_card.className = "well card_tmplt"; 

            /* ### ### ### 'General Info' card  ### ### ### ### ### ### */
            /* components:
            DIV: gnrl_crd_titl
                gnrl_crd_symbl
            DIV: gnrl_crd_body_div
                header:Desciption
                crd_descrpt
            DIV: gnrl_crd_footer_div
                gnrl_crd_back_btn
            */
            let gnrl_crd_titl_div = document.createElement("div"); // DIV to contain the title:'Desciption' 
                genrl_card.appendChild(gnrl_crd_titl_div);
            let gnrl_crd_body_div = document.createElement("div"); // DIV to contain Coin Desciption 
                genrl_card.appendChild(gnrl_crd_body_div);
            let gnrl_crd_footr_div = document.createElement("div"); // for Back btn 
                genrl_card.appendChild(gnrl_crd_footr_div);
            let gnrl_crd_symbl = card.children[1].cloneNode(true);// coin symbol
                gnrl_crd_symbl.id = "gnrl_crd_symble";
                gnrl_crd_titl_div.appendChild(gnrl_crd_symbl);
            const gnrl_crd_hed = document.createElement("p"); // header for desciption(general card)
                gnrl_crd_hed.id = "gnrl_crd_hed";
                gnrl_crd_body_div.appendChild(gnrl_crd_hed);
                gnrl_crd_hed.innerHTML = "<b> <p style='text-align:center; font-size:14px; font-weight:bold''> DESCRIPTION </p></b>";
            let gnrl_crd_descrpt = document.createElement("p"); // coin description
                gnrl_crd_descrpt.id = "gnrl_crd_descrpt";
                gnrl_crd_body_div.appendChild(gnrl_crd_descrpt);
            let gnrl_crd_back_btn = card.children[4].cloneNode(true);// genrl_info_btn
                gnrl_crd_back_btn.id = "gnrl_crd_back_btn";
                gnrl_crd_footr_div.appendChild(gnrl_crd_back_btn);
                gnrl_crd_back_btn.innerText = "Back"; // 'MoreInfo' btn is changed to 'Back' btn
                
                gnrl_crd_back_btn.addEventListener("click", show_rglr_card );

            /*********** 'General Info' card STYLES  ************/
            genrl_card.style.position = "relative" ;
            genrl_card.style.top= "0px";
            genrl_card.style.left= "0px";
            genrl_card.style.height= "200px";
            genrl_card.style.width= "inherint";
            genrl_card.style.zIndex= "+1";
            // gnrl_crd_titl_div
            gnrl_crd_titl_div.style.position = "absolute" ; //  "relative" rcnt_crd_fresh_div
            gnrl_crd_titl_div.style.top = "10%";
            gnrl_crd_titl_div.style.height = "10%";
            gnrl_crd_titl_div.style.left = "1%";
            gnrl_crd_titl_div.style.width = "98%";
            //gnrl_crd_symbl
            gnrl_crd_symbl.style.position =  "absolute" ;//  rcnt_crd_fresh_div
            gnrl_crd_symbl.style.top = "0%";
            gnrl_crd_symbl.style.left = "2%"; 
            gnrl_crd_symbl.style.width = "50%";
            gnrl_crd_symbl.style.fontSize = "28px";
            gnrl_crd_symbl.style.color = "DarkGoldenrod";
            // gnrl_crd_body_div
            gnrl_crd_body_div.style.position =  "absolute" ;//  
            gnrl_crd_body_div.style.top = "25%";
            gnrl_crd_body_div.style.height = "75%";
            gnrl_crd_body_div.style.left = "1%";//  
            gnrl_crd_body_div.style.width = "98%";
            gnrl_crd_body_div.style.overflowY = "auto";
            gnrl_crd_body_div.style.wordBreak = "normal";
            //gnrl_crd_footr_div
            gnrl_crd_footr_div.position =  "absolute" ;
            gnrl_crd_footr_div.top = "3px";
            gnrl_crd_footr_div.style.height = "20px";
            //gnrl_crd_back_btn 
            gnrl_crd_back_btn.style.position =  "absolute" ;
            gnrl_crd_back_btn.style.top = "3px";
            gnrl_crd_back_btn.style.height = "18px";
            gnrl_crd_back_btn.style.width = "96%";

            /* ### ### ### ''Recent Info' card  ### ### ### ### ### ### */
            /* components:
            DIV: rcnt_crd_titl_div
                rcnt_crd_pic
                txt_symbl
                coin_name
                back_btn
            DIV: rcnt_crd_fresh_div
                header1:PRICES
                usd_valu
                eur_valu
                ils_valu
                header2:CHANGES
                24h change
                30d change
            */
            let rcnt_crd_titl_div = document.createElement("div"); // DIV 
                rcnt_crd_titl_div.id = "rcnt_crd_titl_div";
                recnt_card.appendChild(rcnt_crd_titl_div);
                rcnt_crd_titl_div.style.position = "flex";
            let rcnt_crd_fresh_div = document.createElement("div"); // DIV to contain fresh market values info
                rcnt_crd_fresh_div.id = "rcnt_crd_fresh_div";
                recnt_card.appendChild(rcnt_crd_fresh_div);
                rcnt_crd_fresh_div.style.position = "flex";
                rcnt_crd_fresh_div.style.borderLeft = "1px solid DimGray";

                let rcnt_crd_pic = document.createElement("img"); // coin logo 
                    rcnt_crd_pic.id = "rcnt_crd_pic";
                    rcnt_crd_titl_div.appendChild(rcnt_crd_pic);

                let txt_symbl = card.children[1].cloneNode(true);
                    rcnt_crd_titl_div.appendChild(txt_symbl);
                let coin_name = card.children[2].cloneNode(true);
                    rcnt_crd_titl_div.appendChild(coin_name);

                let back_btn = card.children[4].cloneNode(true);// _btn
                    rcnt_crd_titl_div.appendChild(back_btn);
                    back_btn.id = "back_btn";    // 'MoreInfo' btn is changed to 'Back' btn
                    back_btn.innerText = "Back"; // 'MoreInfo' btn is changed to 'Back' btn
                    back_btn.addEventListener("click", show_rglr_card );

                const rcnt_crd_hed1 = document.createElement("p"); // header for the coin PRICES
                    rcnt_crd_hed1.id = "rcnt_crd_hed1";
                    rcnt_crd_fresh_div.appendChild(rcnt_crd_hed1);
                    rcnt_crd_hed1.innerHTML = "<b> <p style='text-align:center; font-size:12px; font-weight:bold'>&nbsp TODAY'S PRICE </p></b>";

                let rcnt_crd_id = document.createElement("p"); // 
                    rcnt_crd_id.id = "rcnt_crd_id";
                    rcnt_crd_titl_div.appendChild(rcnt_crd_id);

                let rcnt_crd_usd_valu = document.createElement("p"); // US Dollar($) value // string from API
                    rcnt_crd_usd_valu.id = "rcnt_crd_usd_valu";
                    rcnt_crd_fresh_div.appendChild(rcnt_crd_usd_valu);

                let rcnt_crd_eur_valu = document.createElement("p"); // EURO(€)  value
                    rcnt_crd_eur_valu.id = "rcnt_crd_eur_valu";
                    rcnt_crd_fresh_div.appendChild(rcnt_crd_eur_valu);

                let rcnt_crd_ils_valu = document.createElement("p"); // Israel-Shekel(‏₪) value
                    rcnt_crd_ils_valu.id = "rcnt_crd_ils_valu";
                    rcnt_crd_fresh_div.appendChild(rcnt_crd_ils_valu);

                const rcnt_crd_hed2 = document.createElement("p"); // header for the coin CHANGES OF prices
                    rcnt_crd_hed2.id = "rcnt_crd_hed2";
                    rcnt_crd_fresh_div.appendChild(rcnt_crd_hed2);
                    rcnt_crd_hed2.innerHTML = " &nbsp  CHANGES"; // position:absolute; top:60%;

                let chang_percntg_24h = document.createElement("p"); // 24hours chang(in %)
                    chang_percntg_24h.id = "chang_percntg_24h"; 
                    rcnt_crd_fresh_div.appendChild(chang_percntg_24h);

                let chang_percntg_30d = document.createElement("p"); // last 30 days chang(in %)
                    chang_percntg_30d.id = "chang_percntg_30d";
                    rcnt_crd_fresh_div.appendChild(chang_percntg_30d);

            /*********** 'Recent Info' card STYLES ************/
            recnt_card.style.position = "relative" ;
            recnt_card.style.top= "0px";
            recnt_card.style.left= "0px";
            //rcnt_crd_titl_div
            rcnt_crd_titl_div.style.position = "absolute" ;//  rcnt_crd_fresh_div
            rcnt_crd_titl_div.style.top = "0px";
            rcnt_crd_titl_div.style.left = "0px";//  
            rcnt_crd_titl_div.style.width = "45%";//  
            rcnt_crd_titl_div.style.height = "100%";
            // rcnt_crd_pic
            rcnt_crd_pic.style.position = "absolute"; 
            rcnt_crd_pic.style.top = "3%";//  symbl_pic: coin logo picture
            rcnt_crd_pic.style.height = "30%";//  symbl_pic: coin logo picture
            rcnt_crd_pic.style.left = "30%";//  symbl_pic: coin logo picture
            rcnt_crd_pic.style.width = "40%";//  symbl_pic: coin logo picture
            rcnt_crd_pic.style.backgroundColor = "white";//  symbl_pic: coin logo picture
            rcnt_crd_pic.className="img-rounded"; 
            // txt_symbl
            txt_symbl.style.top = "25%";
            txt_symbl.style.left = "5%"; 
            txt_symbl.style.width = "90%"; 
            txt_symbl.style.textAlign = "center"; 
            // coin_name
            coin_name.style.top = "55%";
            coin_name.style.left = "1%"; 
            coin_name.style.width = "98%"; 
            coin_name.style.textAlign = "center"; 
            //rcnt_crd_fresh_div
            rcnt_crd_fresh_div.style.position = "absolute" ;//  rcnt_crd_fresh_div
            rcnt_crd_fresh_div.style.top = "0px";
            rcnt_crd_fresh_div.style.right = "0px";//  
            rcnt_crd_fresh_div.style.width = "55%";//  
            rcnt_crd_fresh_div.style.height = "100%";
            //rcnt_crd_hed1
            rcnt_crd_hed1.style.position = "absolute"; // header for the coin PRICES 
            rcnt_crd_hed1.style.top = "3%";
            rcnt_crd_hed1.style.left = "0px";
            //rcnt_crd_usd_valu
            rcnt_crd_usd_valu.style.position = "absolute";    //  styling new element- usd_valu
            rcnt_crd_usd_valu.style.top = "12%";    //  styling new element- usd_valu
            rcnt_crd_usd_valu.style.width = "100px"; //  USD_valu
            rcnt_crd_usd_valu.style.height = "5px"; //   USD_valu
            rcnt_crd_usd_valu.style.textAlign = "center"; 
            //rcnt_crd_eur_valu
            rcnt_crd_eur_valu.style.position = "absolute";   //  styling new element- eur_valu
            rcnt_crd_eur_valu.style.top = "24%";   //  styling new element- eur_valu
            rcnt_crd_eur_valu.style.width = "100px"; //  eur_valu
            rcnt_crd_eur_valu.style.height = "5px"; //  eur_valu
            rcnt_crd_eur_valu.style.textAlign = "center"; 
            //rcnt_crd_ils_valu
            rcnt_crd_ils_valu.style.position = "absolute";    //  styling new element- ils_valu
            rcnt_crd_ils_valu.style.top = "36%";   //  styling new element- ils_valu
            rcnt_crd_ils_valu.style.width = "100px"; //  ils_valu
            rcnt_crd_ils_valu.style.height = "5px"; //  ils_valu
            rcnt_crd_ils_valu.style.textAlign = "center"; 
            //rcnt_crd_hed2: CHANGES
            rcnt_crd_hed2.style.position = "absolute"; // // header for the coin CHANGES OF prices 
            rcnt_crd_hed2.style.top = "60%";
            rcnt_crd_hed2.style.textAlign ="center";
            rcnt_crd_hed2.style.fontSize ="12px";
            rcnt_crd_hed2.style.fontWeight ="bold"; 
            //chang_percntg_24h
            chang_percntg_24h.style.position = "absolute";    //  styling new element- chang_percntg_24h
            chang_percntg_24h.style.top = "68%";   //  styling new element- chang_percntg_24h
            chang_percntg_24h.style.width = "115px"; //  chang_percntg_24h
            chang_percntg_24h.style.height = "0px"; //  chang_percntg_24h
            //chang_percntg_30d
            chang_percntg_30d.style.position = "absolute";   //  styling new element- chang_percntg_30d  
            chang_percntg_30d.style.top = "82%";   //  styling new element- chang_percntg_30d  
            chang_percntg_30d.style.width = "115px"; //  chang_percntg_30d
            chang_percntg_30d.style.height = "0px"; //  chang_percntg_30d
            /* ************END BUILD 2 CARDS  *********************************************** */

            /**********Begin Inject data from API into the 2 cards *************************** */
            console.log(update_time); //update_time is time_of_fetch

            rcnt_crd_pic.src = coin_data.image.small;
            rcnt_crd_usd_valu.innerHTML = "<b> $</b>"+coin_data.market_data.current_price.usd;//$
            rcnt_crd_eur_valu.innerHTML = "<b> &#8364</b>"+coin_data.market_data.current_price.eur;//EUR
            rcnt_crd_ils_valu.innerHTML  = "<b> &#8362 </b>" +coin_data.market_data.current_price.ils;//NIS
            // gnrl_crd_descrpt
            if(coin_data.description.en){
                gnrl_crd_descrpt.innerHTML= coin_data.description.en;
                } else {
                    gnrl_crd_descrpt.innerHTML= "Not Available...";
                }

            crd_fetch_info_time.value = update_time;// time stamp of fetch

            let chang_24h_numbr = coin_data.market_data.price_change_percentage_24h;
            if(chang_24h_numbr) { chang_24h_numbr = chang_24h_numbr.toFixed(2);}
            let chang_30d_numbr = coin_data.market_data.price_change_percentage_30d;
                if(chang_30d_numbr) { chang_30d_numbr = chang_30d_numbr.toFixed(2);}
            chang_percntg_24h.innerHTML = '<p><b>&nbsp 24h: <img src="'+ up_down_arrow(chang_24h_numbr)+' " width="13" height="13"><span style="background-color:'+green_red_color(chang_24h_numbr) +'">&nbsp' +chang_24h_numbr +'% &nbsp</span></b></p>'; // src<=up_down_arrow(chang_24h_numbr)
            chang_percntg_30d.innerHTML = '<p><b>&nbsp 30d: <img src="'+ up_down_arrow(chang_30d_numbr)+' " width="13" height="13"><span style="background-color:'+green_red_color(chang_30d_numbr) +'">&nbsp' +chang_30d_numbr +'% &nbsp</span></b></p>'; // src<=up_down_arrow(chang_24h_numbr)

            function up_down_arrow(valu){
                if (valu>0)     { return "./images/Arrow-green.gif";}
                else if (valu<0){ return "./images/Arrow-red.gif";}
                else            { return "./images/No-Change.jpg";}
            }
            function green_red_color(valu){
                if (valu>0)     { return "green";}
                else if (valu<0){ return "red";}
                else            { return "gray";}
            }
            /**********END Inject data from API into the 2 cards ********************************** */

            /* ********** display the apropriare cards ******************************************** */
            if (disply_card)        { card.style.display = "flex"; } // console.log ("card display");
            else                    { card.style.display = "none"; } // console.log ("card NOT disp");

            if (disply_genrl_card)  { genrl_card.style.display = "flex"; } //console.log ("genrl card display");
            else                    { genrl_card.style.display = "none"; } //console.log ("genrl card NOT dis");

            if (disply_recnt_card)  { recnt_card.style.display = "flex";} //  console.log ("Recnt card display"); 
            else                    { recnt_card.style.display = "none"; } //  console.log ("Recnt car dNOT disp");

            function show_rglr_card(){// show regular card
                disply_card = true;
                card.style.display = "flex";

                disply_genrl_card = false;
                genrl_card.style.display = "none";
                
                disply_recnt_card = false;
                recnt_card.style.display = "none";

            }// func.show_rglr_card close


         /******* 'General-Info' + 'Recent-Info' cards Appendings *********/
             //genrl_card 
            card_contnr.appendChild(genrl_card); // make 'genrl_card' to be a child of 'card container'
            if(card_marked) {
                let genrl_card_copy;
                    genrl_card_copy ='<div class="unit"><h5>About ' + genrl_card.children[0].innerText// ZRX
                    genrl_card_copy = genrl_card_copy + '</h5><p>' +genrl_card.children[1].children[1].innerText +' </p></div>' // ZRX  designed to offer ...
                v_side_div2.innerHTML += genrl_card_copy;
            } // if(card_marked) close

            //recnt_card 
            card_contnr.appendChild(recnt_card); // make 'recnt_card' to be a child of 'card container'
            if(card_marked) { 
                let recnt_card_copy = (recnt_card.cloneNode(true));
                    recnt_card_copy.id = "recnt_card_copy";
                    recnt_card_copy.children[0].children[3].style.display = "none"; // back btn
                v_side_div1.appendChild(recnt_card_copy);
            } // if(card_marked) close

            /* <<< <<<<<<<<<<<<<<<<<<<<<<<<<<<<< ACORDION SCRIPT <<<<<<<<<<<<<<<<<<<<<<<<<<< <<< */
            let units = document.querySelectorAll('.unit');
            units.forEach(unit => unit.addEventListener('click', () => {
                if(unit.classList.contains('open')){
                    unit.classList.remove('open');
                } else {
                    units.forEach(unit2 => unit2.classList.remove('open'));
                    unit.classList.add('open');
                }
            }));
            /* <<< <<<<<<<<<<<<<<<<<<<<<<<<< END ACORDION SCRIPT <<<<<<<<<<<<<<<<<<<<<<<<<< <<< */

        } //func. build2cards close 
        /******* ******* ****** ******* END build2ccrds ******* ******* ******* ******* ******* */

        function coin_have_data(coin_id){
            console.log(coin_id);
            let have_data = false;
            for (i=0;i<coins_with_data_arr.length;i++) {
                if(coin_id === coins_with_data_arr[i]){
                    have_data = true;
                }
            };//for close
            if(have_data) return true;
                else{
                    alert (' No sufficient information for the coin: \n ' + coin_id +'\n Sufficient data was not found. \n This currency can not be included in the cross-comparative analysis in the "Reports" section.');
                    return false;
                };
        } // func. coin_have_data close

    } // 'make_card()' close
    /* @@@ @@@@@@@@@@@@  END MAKE CARD  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

    /* ******** MODAL POP-UP func *************************************************** */
    function modal_popup_func() { //modal_popup_func
        $(v_coins_div).prepend('<button id="modal_triger_btn">.</button>');//creating a virtual btn  
        $("#modal_triger_btn").hide();
        $("#modal_triger_btn").on( "click", popup_triger_was_clicked());
        let modal_deleted_cions = [];
            function popup_triger_was_clicked(){
                console.log( "modal_triger_btn - was virtually clicked" );
                let modal_popup_box = new tingle.modal({
                    closeMethods: [],// disable  closeMethods: ['overlay','button','escape'],
                    footer: true,
                    stickyFooter: true
                });
                modal_popup_box.open();
                $("#modal_triger_btn" ).click();// virtual click to activate the modal popup
             /* ******************************************* */
                modal_popup_box.addFooterBtn('Show Reports', 'tingle-btn tingle-btn--primary tingle-btn--pull-left',Show_clicked);
                function Show_clicked(){
                    // update to_reprts_arr
                    for (i=0;i< modal_deleted_cions.length;i++){ //remove_item_from_arr[i]
                        for (i2=0;i2<to_reprts_arr.length; i2++){
                            if (modal_deleted_cions[i] === to_reprts_arr[i2]){
                                to_reprts_arr.splice(i2,1);
                                modal_deleted_cions.splice(i,1);
                            } 
                        }
                    }
                    if (to_reprts_arr.length>5){
                        alert(' You May Choose Up to 5 Currencies to be analaized in "Reports" section \n please uncheck currency symbol ')
                    } else {
                    reprts_func(); 
                    modal_popup_box.close();
                    modal_popup_box.destroy()
                    };
            } // func. Show close
                modal_popup_box.addFooterBtn('Cancel', 'tingle-btn tingle-btn--default tingle-btn--pull-left', cancel_clicked)
                function cancel_clicked() {
                    console.log('Cancel-was clicked !!!');
                        // update to_reprts_arr
                        for (i=0;i< modal_deleted_cions.length;i++){ //remove_item_from_arr[i]
                            for (i2=0;i2<to_reprts_arr.length; i2++){
                                if (modal_deleted_cions[i] === to_reprts_arr[i2]){
                                    to_reprts_arr.splice(i2,1);
                                    modal_deleted_cions.splice(i,1);
                                } 
                            }
                        }
                    modal_popup_box.close();
                    modal_popup_box.destroy()
                };  // func. cancel close
                    /* ********************************** */
                let modal_contnt = '<div><p class="modal_titl"> Reports<br>Up to 5 Coins </p>'
                    modal_contnt = modal_contnt+'<p class="modal_sub_titl"> please uncheck to continue</p>'//
                    for(i=0;i<to_reprts_arr.length;i++){
                        let iner_html_2= '<input type="checkbox" checked class="switch_input TOGGLE" id="togl'+i+'" style="position:absolute; top:'+ (125+i*30) +'><span class="slider"></span>'
                        let slider_id = "togl"+i;
                        modal_contnt = modal_contnt +'<div class="modal_coin_clas" style="position:relative; left:10%">'+ '<label>'+to_reprts_arr[i]+'</lable><input type="checkbox" checked class="switch_input TOGGLE" ><span class="slider" style="position:absolute; left: 70%" id="' +slider_id +'"></span></div>' ;
                     }// for i<to_reprts_arr.length close
                    modal_contnt+='</div>'
                    // console.log(modal_contnt); 
                    modal_popup_box.setContent(modal_contnt);

                let cliked_coin;      
                $("#togl0").click( function(evnt) {cliked_coin = to_reprts_arr[0]; modal_togl_btn_clicked(evnt)}); 
                $("#togl1").click( function(evnt) {cliked_coin = to_reprts_arr[1]; modal_togl_btn_clicked(evnt)});
                $("#togl2").click( function(evnt) {cliked_coin = to_reprts_arr[2]; modal_togl_btn_clicked(evnt)});
                $("#togl3").click( function(evnt) {cliked_coin = to_reprts_arr[3]; modal_togl_btn_clicked(evnt)});
                $("#togl4").click( function(evnt) {cliked_coin = to_reprts_arr[4]; modal_togl_btn_clicked(evnt)});
                $("#togl5").click( function(evnt) {cliked_coin = to_reprts_arr[5]; modal_togl_btn_clicked(evnt)});

                function modal_togl_btn_clicked(e){

                    let cliked_coin_index = all_coins_arr.indexOf(cliked_coin) // return -1 if not included
                    console.log(card[cliked_coin_index]) ; 

                    card[cliked_coin_index].children[3].children[0].click(); // click on the buttn of the card in the main coins display

                    if (modal_deleted_cions.includes(cliked_coin)) {remove_item_from_arr(modal_deleted_cions,cliked_coin)}
                        else{ modal_deleted_cions.push(cliked_coin)}   

                } // func. modal_togl_btn_clicked() ok?
            };//func. triger_was_clicked close
                        
            function remove_item_from_arr(arr,item){
                for( i=0; i<arr.length;i++){
                    if (arr[i] === item) {arr.splice.arr(i,1)}
                }
            }
        } // modal_popup_func close


    /* @@@@@@@@@  REPORTS  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    function fetch_list_4reports(){
        // console.log("fetch_list_4reports start");
        const url3 = 'https://min-api.cryptocompare.com/data/all/coinlist' ;
        fetch(url3) 
            .then((response) => {
                return response.json();
            }) // '.then1' close
            .then((data_from_api) => { 
                coins_with_data_arr =  Object.values(data_from_api)[2]  ;// turn the "data" object to an array.(key is coin name)
                coins_with_data_arr = Object.values(coins_with_data_arr);// turn the "data" object to an array.(keys are 1,2,3,.... )

                for (i = 0; i<coins_with_data_arr.length; i++) {
                    coins_with_data_arr[i] = coins_with_data_arr[i].Symbol; //keys are 1,2,3,.... items: symbols )
                } // for... close
            }); // '.then2' close

    }; // 'fetch_list_4reports()' close 
    /* *************************************************************** */  
    /* ********  reprts_func  **************************************** */
    function reprts_func() {
        if (to_reprts_arr.length === 0){
            alert('Please Chose At Least One Currency To Be Included In "Reports"');
            coins_func();
        } 
        else { 

            make_info_divs();
            fetch_and_make_chart_5coins_all_histoty();
            fetch_mak_chart_And_update_5curnt_prices();

            v_coins_div.style.display = "none";
            v_reprts_div.style.display = "flex"; 
            v_about_div.style.display = "none";

        } // else close
        
        /* *****append info(recent info & general info) to 2 divs() ******* */  
         function make_info_divs(){
             //console.log( 'func.make_info_div START');
             let i_of_found_card;
             v_side_div1.innerHTML = "";
             v_side_div2.innerHTML = "";
            card_marked = true;
            for (i=0;i<to_reprts_arr.length; i++){ 
 
                for (i2=0 ; i2<all_coins_arr.length ; i2++){
                    if (all_coins_arr[i2] === to_reprts_arr[i]) {
                        i_of_found_card = i2;
                        break
                    }
                }
                card[i_of_found_card].children[4].click();// Recent Info btn clicked. (cause to fetch info to reports section)
                } // for i<to_reprts_arr.length close
        } // func.make_info_divs(){

        
        /* *****fetch & build chart_5coins ALL HISTORY (up to 5 coins)******* */  
        function fetch_and_make_chart_5coins_all_histoty() {
            for(i=0; i<to_reprts_arr.length; i++) {
                fethch1coin_all_histry(to_reprts_arr[i],i);
            } // for i<to_reprts_arr.length close

        /*********************************************************************/

            function fethch1coin_all_histry(coin_id,coin_num){
                let data_arr = [];
                let coin_time_histry= []; //array of dates in the history
                let coin_clos_histry= []; //array of close values in the those dates 
                
                let url4 = 'https://min-api.cryptocompare.com/data/histoday?fsym='+coin_id+'&tsym=USD&allData=true';//all history-by days
                let url5 = 'https://min-api.cryptocompare.com/data/histohour?fsym='+coin_id+'&tsym=USD&limit=24';//last 24h - by h
                let url6 = 'https://min-api.cryptocompare.com/data/histominute?fsym='+coin_id+'&tsym=USD&limit=60';//last 1h by minutes

                let old_histry = [];
                let last_24h_histry = [];
                let last_1h_histry = [];
                
                let coin_histry = []; //old_histr+ +last_24h+last_1h

                fethch1coin_histry1();// part1:old_histry
                fethch1coin_histry2();// part2:last_24h_histry
                fethch1coin_histry3(); // part3:last_1h_histry

                /*************************************/
                function fethch1coin_histry1(){  //all history-by days
                    fetch(url4) 
                        .then((response) => {
                            return response.json();
                        }) // '.then1' close
                        .then((data_from_api) => { 
                            data_arr = Object.values(data_from_api)[3]  ;// turn the "data" object to an array.keys: 1,2,3,.... item:{time: 1539734400,,, close: 0.0197,,}
                            for (i = 0; i<data_arr.length-2; i++) {
                                old_histry[i] = data_arr[i]
                            } // for... close
                        }); // '.then2' close
                } //fethch1coin_histry1 close 
                /* ************************** */
                function fethch1coin_histry2(){ //last 24h - by h 
                    fetch(url5) 
                        .then((response) => {
                            return response.json();
                        }) // '.then1' close
                        .then((data_from_api) => { 
                            data_arr =  Object.values(data_from_api)[3]  ;// turn the "data" object to an array.keys: 1,2,3,.... item:{time: 1539734400,,, close: 0.0197,,}
                            for (i = 1; i<data_arr.length-2; i++) {
                                last_24h_histry[i-1] = data_arr[i] // last_24h_histry
                            } // for... close
                        }); // '.then2' close
                } //fethch1coin_histry2 close 
                /* ************************** */
                function fethch1coin_histry3(){    //last 1h by minutes
                    fetch(url6) 
                        .then((response) => {
                            return response.json();
                        }) // '.then1' close
                        .then((data_from_api) => { 
                            data_arr = Object.values(data_from_api)[3]  ;// turn the "data" object to an array.keys: 1,2,3,.... item:{time: 1539734400,,, close: 0.0197,,}
                            for (i = 1; i<data_arr.length-2; i++) {
                                last_1h_histry[i-1] = data_arr[i]
                            } // for... close

                            /* ******fethch1coin_histry3 continue...******** */  

                            //console.log(last_1h_histry);
                            coin_histry = old_histry.concat(last_24h_histry,last_1h_histry);// concat to 1 array

                            for (i=0;i<coin_histry.length;i++){
                                coin_time_histry[i] = 1000*coin_histry[i].time; //keys: 1,2,3,.... items: dates )// x1000 to put in JS date fotmat of milli-seconds
                                coin_clos_histry[i] = coin_histry[i].close; //keys: 1,2,3,.... items: 'closing rate' in $)
                            }
                            mak_histry_chart();

                                arr5coins_time_histry[coin_num] = [...coin_time_histry];//copy arr content
                                arr5coins_clos_histry[coin_num] = [...coin_clos_histry]; //copy arr content


                        }); // '.then2' close

                } //fethch1coin_histry3 close 
                /********************************/
                } // 'fethch1coin_all_histry()' close 
            // };//fetch5coins_history()
        } // fetch_and_make_chart_5coins_all_histoty()  close 

    /******************* HISTOTY CHARTS ******************************/ 
    function mak_histry_chart(){ 
        console.log(arr5coins_time_histry[0]); // global var but filed only after fetch !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log(arr5coins_clos_histry[0]);


/*******************CART  - Time Series with User Range slider******************************/ 

        Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", function(err, rows){

            let x1 = arr5coins_time_histry[0];  
            let y1 = arr5coins_clos_histry[0];

            let x2 = arr5coins_time_histry[1]  
            let y2 = arr5coins_clos_histry[1]        
            
            let x3 = arr5coins_time_histry[2]  
            let y3 = arr5coins_clos_histry[2]        
            
            let x4 = arr5coins_time_histry[3]  
            let y4 = arr5coins_clos_histry[3]        
            
            let x5 = arr5coins_time_histry[4]  
            let y5 = arr5coins_clos_histry[4]  

            function unpack(rows, key) {
                return rows.map(function(row) { return row[key]; });
            }
            let trace1 = {
                type: "scatter",
                mode: "lines",
                name: to_reprts_arr[0], 
                x: x1,
                y: y1,
                line: {color: 'DarkTurquoise'}
                }
            let trace2 = {
                type: "scatter",
                mode: "lines",
                name: to_reprts_arr[1], 
                x: x2,
                y: y2,
                line: {color: 'SeaGreen'}
                }
            let trace3 = {
                type: "scatter",
                mode: "lines",
                name: to_reprts_arr[2], 
                x: x3,
                y: y3,
                line: {color: 'Fuchsia'}
                }
            let trace4 = {
                type: "scatter",
                mode: "lines",
                name: to_reprts_arr[3], 
                x: x4,
                y: y4,
                line: {color: 'Purple'}
                }
            let trace5 = {
                type: "scatter",
                mode: "lines",
                name: to_reprts_arr[4], 
                x: x5,
                y: y5,
                line: {color: 'Maroon'}
                }
            let data = [trace1,trace2,trace3,trace4,trace5];
                    
            let layout = {
            title: 'Time Series with Rangeslider', 
            xaxis: {
                autorange: true, 
                range: [new Date(2017, 11, 31, 23, 59) , new Date(2019, 5, 30, 23, 59)], 
                rangeselector: {buttons: [
                    {
                    count: 10, 
                    label: 'RT', 
                    step: 'minute', 
                    stepmode:  'backward'
                    }, 
                    {
                    count: 1, 
                    label: '1h', 
                    step: 'hour', 
                    stepmode: 'backward'
                    }, 
                    {
                    count: 1, 
                    label: '1d', 
                    step: 'day', 
                    stepmode: 'backward'
                    }, 
                    {
                    count: 1, 
                    label: '1m', 
                    step: 'month', 
                    stepmode: 'backward'
                    }, 
                    {
                    count: 12, 
                    label: '1y', 
                    step: 'month', 
                    stepmode: 'backward'
                    }, 
                    {      
                    count: 3, 
                    label: '3y', 
                    step: 'year', 
                    stepmode: 'backward'
                    },       
                    {step: 'all'}
                ]}, // range selector buttons: close

                rangeslider: {range: [new Date(2012, 0, 1, 00, 01) , new Date(2019, 5, 30, 23, 59)] }, 
                type: 'date'
            }, 
 
            yaxis: {
                title: 'USD value (log scale)',
                autorange: true, 
                type: 'log'
            },
            margin: { t: 80} ,
            /*  margin: { r:50, l:50, b: 120, t: 100, pad: 40 }  */
            paper_bgcolor: 'Beige' ,
            plot_bgcolor: 'Ivory'
            };// layout  close

            Plotly.newPlot('chart_div2', data, layout, {responsive: true}, {showSendToCloud: true});

      } ) // Plotly.d3.csv("https:...." , function(){  close
  } //  func. mak_histry_chart close

/*  ********************************************************* */

/*
https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD
Object
BTC: Object
USD: 8681.54
ETH: Object
USD: 272.18
*/

            /*############################################################## */
            function fetch_mak_chart_And_update_5curnt_prices(){
                let fetch_5_curnt_prices_never_done_yet = true;

                let updat_5curnt = setInterval(fetch_5curnt_prices,4000);
                function stop_updating() {
                    clearInterval(updat_5curnt);
                   
                    } // STOP !!!
                    updat_5curnt;
                    v_coins_btn.addEventListener("click",stop_updating);

            //} // func.  fetch_mak_chart_And_update_5curnt_prices close


            function fetch_5curnt_prices(){ //fetch the 5 coins curnt prices prices for the live_chart

                let coins_curnt_pric_arr= []; //array of current prices 
                let coins_time_of_curnt_pric_arr= []; //array of the hour of the price

                for(i=0; i<to_reprts_arr.length; i++) {
                    fetch_1curnt_pric(to_reprts_arr[i],i);
                } // for i<to_reprts_arr.length close

                function fetch_1curnt_pric(coin_id,coin_num){ 
                    let url6 = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+coin_id+'&tsyms=USD'

                    console.log("fetching 5 curnt_prices");
                    console.log(new Date());
                    
                    fetch(url6) 
                    .then((response) => {
                        return response.json();
                    }) // '.then1' close
                    .then((data_from_api) => { 
                       
                        //arr5coins_clos_histry[0].push(data_from_api.to_reprts_arr[0].USD);  
                        let data_from_servr= Object.values(data_from_api); //turn the "data" object to an array.(keys are 1,2,3,.... )
                        console.log((data_from_servr[0])); 

                        coins_curnt_pric_arr[coin_num] = Object.values(data_from_servr[0])[0];//turn the object{USD: 0.8488} to an array:[0.8488] and take the value (in position[0])
                        coins_time_of_curnt_pric_arr[coin_num]=Date.now();

                        console.log(coins_curnt_pric_arr); 
                        console.log(coins_time_of_curnt_pric_arr); 

                        //mak_live_chart(); 
                        if ( fetch_5_curnt_prices_never_done_yet) {
                            mak_live_chart(); 
                            fetch_5_curnt_prices_never_done_yet = false;         
                        }
                        
                        //document.getElementById('chart_div1').innerHTML = '<img src = "./images/RT-PIC.gif" >'

                    }); // '.then2' close
                } // func. fetch_1curnt_pric close
                        /* ############################################################################################################### */
                        /* ******** LIVE CHART ******************* */
                function mak_live_chart(){ //
                    console.log("mak_live_chart - begin");

                            let x1 = arr5coins_time_histry[0];  
                            let y1 = arr5coins_clos_histry[0];
                            let trace_name1 = to_reprts_arr[0] 
                            let line_colr1 = {color: 'DarkTurquoise'} 

                            let x2; 
                            let y2;
                            let trace_name2; 
                            let line_colr2;
                            let x3; 
                            let y3; 
                            let trace_name3; 
                            let line_colr3;
                            let x4; 
                            let y4; 
                            let trace_name4; 
                            let line_colr4;
                            let x5; 
                            let y5; 
                            let trace_name5; 
                            let line_colr5;

                            if (to_reprts_arr.length <2) {
                                x2 = [Date.now()-180000,Date.now()-120000,Date.now()-60000];
                                y2 = [0,0,0];
                                trace_name2 = " "; 
                                line_colr2 = {color: 'Beige'}; 
                            } else{
                                x2 = arr5coins_time_histry[1] ; 
                                y2 = arr5coins_clos_histry[1] ;      
                                trace_name2 = to_reprts_arr[1] ;
                                line_colr2 = {color: 'SeaGreen'}  
                            }

                            if (to_reprts_arr.length <3) {
                                x3 = [Date.now()-180000,Date.now()-120000,Date.now()-60000];
                                y3 = [0,0,0];
                                line_colr3 = {color: 'Beige'}; 

                                trace_name3 = " ";
                            } else{
                                x3 = arr5coins_time_histry[2] ;
                                y3 = arr5coins_clos_histry[2] ;      
                                trace_name3 = to_reprts_arr[2] ;
                                line_colr3 = {color: 'Fuchsia'}  
                            }


                            if (to_reprts_arr.length <4) {
                                x4 = [Date.now()-180000,Date.now()-120000,Date.now()-60000];
                                y4 = [0,0,0];
                                line_colr4 = {color: 'Beige'}; 

                                trace_name4 = " ";
                            } else{
                                x4 = arr5coins_time_histry[3] ;
                                y4 = arr5coins_clos_histry[3] ;       
                                trace_name4 = to_reprts_arr[3] ;
                                line_colr4 = {color: 'Purple'} ;  
                            }
                            
                            if (to_reprts_arr.length <5) {
                                x5 = [Date.now()-180000,Date.now()-120000,Date.now()-60000];
                                y5 = [0,0,0];
                                line_colr5= {color: 'Beige'}; 

                                trace_name5 = " ";
                            } else{
                                x5 = arr5coins_time_histry[4] ; 
                                y5 = arr5coins_clos_histry[4] ; 
                                trace_name5 = to_reprts_arr[4] ;
                                line_colr5 = {color: 'Maroon'} 
                            }

                    var layout = {
                        title: 'LIVE -  Real-Time Chart',
                        xaxis: { 
                            title: 'Update every 2 seconds',
                            type: 'date' ,
                            range: [Date.now()-10000,Date.now()+60000]
                        },
                        yaxis: { 
                            title: 'USD value (log)',
                            type: 'log',
                            range: [ Math.max(...coins_curnt_pric_arr)]
                            //autorange: true,
                        }, 
                        showlegend: true,
                        legend: { x: 1, y: 0.25 },

                        paper_bgcolor: 'Beige' ,
                        plot_bgcolor: 'White',
                        margin: { t: 80} ,
                       /*  margin: { r:50, l:50, b: 120, t: 100, pad: 40 }  */
                    } // layout {close 

                    let build_plot = Plotly.plot('chart_div1',[ 
                        {
                        trace:1,
                        name: trace_name1, 
                        x:x1,
                        y:y1,
                        mode:'lines',
                        line: line_colr1
                        },
                        {
                        trace:2,
                        name: trace_name2, 
                        x:x2,
                        y:y2,
                        mode:'lines',
                        line: line_colr2
                        },
                        {
                        trace:3,
                        name: trace_name3, 
                        x:x3,
                        y:y3,
                        mode:'lines',
                        line: line_colr3
                    },
                        {trace:4,
                        name: trace_name4, 
                        x:x4,
                        y:y4,
                        mode:'lines',
                        line: line_colr4
                    },
                        {trace:5,
                        name: trace_name5,
                        x:x5,
                        y:y5,
                        mode:'lines',
                        line: line_colr5

                    }] , layout); // Plotly.plot( close

                    build_plot; 
                    v_coins_btn.addEventListener("click", function(){ $(build_plot).remove(); });

/* *** *** *** *** *** *** *** *** *** *** *** *** *** */
                /*    
                    let chart_scope = [];
                    for(i=0; i<to_reprts_arr.length; i++) {
                        chart_scope.push(i);
                    } // for i<to_reprts_arr.length close
                    console.log(chart_scope);
                */ 
            function gety1() {
                if(coins_curnt_pric_arr[0])
                // return  coins_curnt_pric_arr[0]  ;
                return arr5coins_clos_histry[0][arr5coins_clos_histry[0].length-1];
            }
            function gety2() {
                if (coins_curnt_pric_arr[1]) {
                //return  coins_curnt_pric_arr[1] ;
                return arr5coins_clos_histry[1][arr5coins_clos_histry[1].length-1];
                }
                else { return null ;}
            } 
            function gety3() {
                if (coins_curnt_pric_arr[2]) {
                //return  coins_curnt_pric_arr[2] ;
                return arr5coins_clos_histry[2][arr5coins_clos_histry[2].length-1];
                }
                else { return null ;}
            } 
            function gety4() {
                if (coins_curnt_pric_arr[3]) {
                    // return  coins_curnt_pric_arr[3] ;
                    return arr5coins_clos_histry[3][arr5coins_clos_histry[3].length-1];
                }
                else { return null ;}
            }  
            function gety5() {
                if (coins_curnt_pric_arr[4]) {
                    // return  coins_curnt_pric_arr[4] ;
                    return arr5coins_clos_histry[4][arr5coins_clos_histry[4].length-1];
                    }
                    else { return null ;}
                }
            function getx1() {
                return Date.now();
            }
            function getx2() {
                return getx1();
                //return Date.now();
            }
            function getx3() {
                return getx1();
                // return Date.now();
            }
            function getx4() {
                return getx1();
                // return Date.now();
            }
            function getx5() {
                return getx1();
                // return Date.now();
            }

                    console.log(gety1()  );
                    console.log(gety2()  );
                    console.log(gety3()  );
                    console.log(gety4()  );
                    console.log(gety5()  );


                     let update_plot = setInterval(function(){
                         Plotly.extendTraces( chart_div1 , { y:[  [gety1()], [gety2()], [gety3()], [gety4()], [gety5()]  ] ,  x: [  [getx1()], [getx2()] ,[getx3()], [getx4()], [getx5()] ]}, [0,1,2,3,4]) // extend multiple traces

                        cuntr++;
                        if(cuntr > 30) {
                            console.log (new Date());
                           cuntr =cuntr-30
                            Plotly.relayout('chart_div1',{
                                xaxis: { 
                                    type: 'date' ,
                                    range: [Date.now()-10000,Date.now()+60000]
                                }
                            });
                        }
                    },2000); // setInterval(func.{ close 

                 /* *** calling update_plot *** */
                    var cuntr = 10;
                    update_plot;
                   // v_coins_btn.addEventListener("click",  delete_plot );
                    // v_coins_btn.addEventListener("click",  rdrw_plot );
                    v_coins_btn.addEventListener("click",  delete_plot );


                    // v_coins_btn.addEventListener("click", function(){ $(update_plot).remove(); });
                    function delete_plot(){
                     //   Plotly.purge(chart_div1)
                        Plotly.purge('chart_div1')
                    }
                    function rdrw_plot(){
                        Plotly.redraw(side_div2);
                    }
                } //func.mak_live_chart() close
              /* ******** END LIVE CHART ******************* */
            } //func.fetch_5curnt_prices() close 
        } // func.  fetch_mak_chart_And_update_5curnt_prices close
    }//reprts_func close
   /*******************   END REPORTS   *************************/



   /* *** ************ ABOUT*************************************************** *** */
    function abot_func() {
        console.log("about func. begin");
        v_coins_div.style.display = "none";
        v_reprts_div.style.display = "none";     
        v_about_div.style.display = "flex"; 
    } // abot_func close



}); // '(document).ready(function{' close




