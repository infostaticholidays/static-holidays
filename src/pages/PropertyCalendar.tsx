import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const getDaysInMonth = (year:number, month:number) => {

  return new Date(year, month + 1, 0).getDate();

};



const formatDate = (date:string) => {

  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {

    day:"numeric",
    month:"long",
    year:"numeric",

  });

};




export default function PropertyCalendar(){


const { propertyId } = useParams();

const navigate = useNavigate();



const [year,setYear] =
useState(new Date().getFullYear());



const [blockedDates,setBlockedDates] =
useState<string[]>([]);



const [rangeStart,setRangeStart] =
useState<string | null>(null);



const [rangeEnd,setRangeEnd] =
useState<string | null>(null);



// NEW - nightly prices

const [prices,setPrices] =
useState<Record<string,number>>({});



const [nightlyPrice,setNightlyPrice] =
useState("");




const handleDateClick = (date:string)=>{


if(!rangeStart || rangeEnd){


setRangeStart(date);

setRangeEnd(null);


}else{


setRangeEnd(date);


}


};





const blockRange = ()=>{


if(!rangeStart || !rangeEnd)
return;



const start = new Date(rangeStart);

const end = new Date(rangeEnd);



const dates:string[]=[];



while(start <= end){


dates.push(
start.toISOString().split("T")[0]
);



start.setDate(
start.getDate()+1
);



}



setBlockedDates([

...blockedDates,

...dates

]);



};






const savePrice = ()=>{


if(!rangeStart || !rangeEnd)
return;



const start =
new Date(rangeStart);


const end =
new Date(rangeEnd);



const newPrices = {
...prices
};




while(start <= end){



const date =
start.toISOString()
.split("T")[0];



newPrices[date] =
Number(nightlyPrice);



start.setDate(
start.getDate()+1
);



}



setPrices(newPrices);



};






return (

<div

style={{

maxWidth:1400,

margin:"40px auto",

padding:30,

fontFamily:"Arial, sans-serif",

}}

>



<h1>
📅 Property Calendar
</h1>



<p>
<strong>Property ID:</strong> {propertyId}
</p>





<div

style={{

background:"#f5f5f5",

padding:20,

borderRadius:12,

marginBottom:30,

}}

>


<h2>
Availability & Pricing
</h2>



<p>
Manage availability, blocked dates, nightly prices and offers.
</p>





<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

}}

>


<button

style={greenBtn}

onClick={()=>
setYear(year-1)
}

>

← Previous Year

</button>




<h2>
{year}
</h2>




<button

style={greenBtn}

onClick={()=>
setYear(year+1)
}

>

Next Year →

</button>



</div>






<div

style={{

marginTop:20,

display:"flex",

gap:15,

flexWrap:"wrap",

}}

>



<button

style={greenBtn}

disabled={!rangeStart || !rangeEnd}

onClick={blockRange}

>

🚫 Block Selected Dates

</button>




</div>



</div>








<div

style={{

display:"grid",

gridTemplateColumns:"repeat(3,1fr)",

gap:20,

}}

>



{months.map((month,index)=>{



const days =
getDaysInMonth(year,index);




return (



<div

key={month}

style={{

border:"1px solid #ddd",

borderRadius:12,

padding:15,

background:"#fff",

}}

>




<h3

style={{

textAlign:"center",

color:"#14532d",

}}

>

{month} {year}

</h3>






<div

style={{

display:"grid",

gridTemplateColumns:"repeat(7,1fr)",

gap:5,

}}

>





{Array.from({length:days}).map((_,day)=>{



const date =

`${year}-${String(index+1).padStart(2,"0")}-${String(day+1).padStart(2,"0")}`;





const isBlocked =
blockedDates.includes(date);




const isStart =
rangeStart === date;




const isRange =

rangeStart &&

rangeEnd &&

date >= rangeStart &&

date <= rangeEnd;





return (



<div

key={date}

onClick={()=>
handleDateClick(date)
}

style={{


height:45,


border:"1px solid #ddd",


borderRadius:6,


display:"flex",


flexDirection:"column",


alignItems:"center",


justifyContent:"center",


cursor:"pointer",



background:


isBlocked

?

"#dc2626"


:


isRange

?

"#fecaca"


:


isStart

?

"#14532d"


:

"#f8faf8",



color:


isBlocked || isStart

?

"white"

:

"black",


fontSize:12,


}}

>


<div>

{day+1}

</div>



{

prices[date] &&

(

<div>

£{prices[date]}

</div>

)

}



</div>



);



})}




</div>




</div>



);



})}




</div>










{rangeStart && (



<div

style={{

marginTop:30,

padding:20,

background:"#fff",

border:"1px solid #ddd",

borderRadius:10,

}}

>



<h3>
Selected Dates
</h3>



<p>

From:

<strong>

{" "}

{formatDate(rangeStart)}

</strong>

</p>




{rangeEnd && (



<p>

To:

<strong>

{" "}

{formatDate(rangeEnd)}

</strong>

</p>



)}





{rangeEnd && (



<div

style={{

marginTop:20,

}}


>



<h3>

Nightly Price

</h3>



<input


type="number"


placeholder="£ per night"


value={nightlyPrice}


onChange={(e)=>

setNightlyPrice(e.target.value)

}


style={{

padding:10,

borderRadius:6,

border:"1px solid #ccc",

fontSize:16,

}}



/>



<button

style={greenBtn}

onClick={savePrice}

>

💷 Save Price

</button>



</div>



)}





</div>



)}









<button

onClick={()=>
navigate("/host-dashboard")
}

style={{

marginTop:40,

background:"#14532d",

color:"white",

border:"none",

padding:"12px 20px",

borderRadius:8,

cursor:"pointer",

}}

>

← Back to Dashboard

</button>





</div>

);

}




const greenBtn = {


background:"#14532d",


color:"white",


border:"none",


padding:"10px 18px",


borderRadius:8,


cursor:"pointer",


};
