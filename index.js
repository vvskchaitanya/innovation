const http = require("http");

const GET_URL = "http://interview.adpeai.com/api/v2/get-task";

function main(){

    getTransactions();


}

/**
 * This method is to get the transactions from get-task endpoint
 */
function getTransactions(){
    http.get(GET_URL,(response)=>{
        
        // Logging response from API
        var data = "";



        response.on("data",(chunk)=>{data+=chunk;});

        response.on("end",()=>{

            // Logging response from API
            console.log(data);

            var resp;

            try{
                resp =JSON.parse(data);
            }catch(error){
                console.error("Unable to parse the json");
            }
            

            var prevYearTransactions = resp.transactions.filter(d=>{
                return d.timeStamp.indexOf("2024-")>-1
            });
    
            var empMap = {};
    
            for(var i in prevYearTransactions){
                var empId = prevYearTransactions[i].employee.id;
                var amount = prevYearTransactions[i].amount;
                if(empMap[empId]==null){
                    empMap[empId] = amount;
                }else{
                    empMap[empId] = empMap[empId] + amount;
                }
            }
    
            var highestAmountEmployee = undefined;
            var amount = 0;
    
            for(var i in empMap){
                if(empMap[i]>amount){
                    highestAmountEmployee = i;
                    amount = empMap[i];
                }
            }
    
            console.log("Highest Amount Employee: "+highestAmountEmployee);
        })

        

    });

}



/**
 * This method is to post the transactions to submit-task endpoint
 */
function submitTransactions(){

}

main();