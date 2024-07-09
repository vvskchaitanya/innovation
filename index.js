const http = require("https");

const GET_URL = "https://interview.adpeai.com/api/v2/get-task";

const SUBMIT_URL = "https://interview.adpeai.com/api/v2/submit-task";

const ALPHA_TYPE = "alpha";

function main(){

    getTransactions();


}

/** Function to get the previous year value */
function getPrevYear(){
    var currentDate = new Date();
    return ""+ currentDate.getFullYear()-1;
}

/**
 * This method is to get the transactions from get-task endpoint
 */
function getTransactions(){

    var prevYear = getPrevYear()+"-";
http.get(GET_URL,{headers:{"Content-Type":"application/json"}},(response)=>{
        
        // Logging response from API
        var data = "";
        response.setEncoding('utf8');
        response.on("data",(chunk)=>{data+=chunk;});

        response.on("end",()=>{

            // Logging response from API
            console.log("Response from API ",data);

            var resp;

            try{
                resp = JSON.parse(data);
            }catch(error){
                console.error("Unable to parse the json");
            }
            

            if(resp == undefined){
                console.log("No Response from API (or) Unable to parse response");
                return;
            }

            // Filtering the transaction with timestamp having the previous year
            var prevYearTransactions = resp.transactions.filter(d=>{
                return d.timeStamp.indexOf(prevYear)==0
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
    
            // 1St Point To identify the employee with highest amount of transactions
            console.log("Highest Amount Employee: "+highestAmountEmployee);

            // 2nd Point to fetch alpha transaction for employee with highest amount
            getAplhaTransactions(highestAmountEmployee,resp.id, prevYearTransactions);
        })

        

    });

}

/**
 * Method to filter alpha transactions
 */
function getAplhaTransactions(empId, id, transactions){
    var alphaTransactions  = transactions.filter(t=>{
        return t.type == ALPHA_TYPE && t.employee.id == empId;
    }).map(o=>o.transactionID);

    var post_req = {id:id,result:alphaTransactions};

    console.log("Submitting Below Post Request to Post Endpoint",post_req);

    submitTransactions(post_req);
}



/**
 * This method is to post the transactions to submit-task endpoint
 */
function submitTransactions(post_req){
    var body = JSON.stringify(post_req);
    
    var url = new URL(SUBMIT_URL);

    console.log("Submitting Post Request ",url.host,url.pathname,body);

    var options = {
        host: url.host,
        path: url.pathname,
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
    }
    var req = http.request(options,(res)=>{
        const { statusCode } = res;
        if(statusCode==200){
            console.log("=====================================");
            console.log("Post Request Submitted Successfull");
        }else{
            console.log("Post Request Submitted Failed HttpStatus: "+statusCode);
        }
    });

    req.write(body);
    req.end();
}

main();