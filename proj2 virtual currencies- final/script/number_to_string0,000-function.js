//  ACTIVITY: accept number and reply string in 10,000 format (formated_string)

function number_to_formated_string(number) { // accept number and reply string in 10,000 format (formated_string)
        var number_strng = number.toString(); 

        var negativ = number_strng.startsWith("-");
        var decimal = number_strng.includes(".");
        decimal_part = ""; 

        if ( negativ) { number_strng = number_strng.substring(1, number_strng.length); }
        if ( decimal) { 
            decimal_part = number_strng.substring(number_strng.indexOf("."), number_strng.length);
            number_strng = number_strng.substring(0, number_strng.indexOf(".") )
        }

        var final_number_string = "";
        var number_array = []; 
        var bolcks= Math.ceil(number_strng.length / 3 ); 

        var j = bolcks - 1; 
        for (i=0; i<bolcks; i++ , j--){ // a loop with i=increasing and j=decreasing

            var sof_mikumim_to_take= (number_strng.length - 3*j - 1 ) // the index of the last integer to extract
            number_array[i] = number_strng.substring(0, sof_mikumim_to_take+1); // [0] ="12" [1]="345" [2]="678"

            number_strng = number_strng.substring(sof_mikumim_to_take+1 , number_strng.length+1 ) // 
        } 
        var i = 0; 
        for (i=0; i<bolcks; i++ ) { // i=0  i=1  i=2
            final_number_string = final_number_string + number_array[i] + "," ;  // "12,"   "12,345,"  "12,345,678,"
        } 


        final_number_string = final_number_string.substr( 0 , final_number_string.length-1 ); // "12,345,678"

        if (negativ) {final_number_string = "-" + final_number_string }
        if (decimal) {final_number_string =  final_number_string + decimal_part }
        return final_number_string;
}
