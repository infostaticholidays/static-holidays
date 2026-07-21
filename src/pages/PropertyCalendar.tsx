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

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatDate = (date: string) => {
  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


export default function PropertyCalendar() {

  const { propertyId } = useParams();
  const navigate = useNavigate();


  const [year, setYear] = useState(
    new Date().getFullYear()
  );


  const [blockedDates, setBlockedDates] = useState<string[]>([]);


  const [rangeStart, setRangeStart] = useState<string | null>(null);

  const [rangeEnd, setRangeEnd] = useState<string | null>(null);



  const handleDateClick = (date:string) => {

    if (!rangeStart || rangeEnd) {

      setRangeStart(date);
      setRangeEnd(null);

    } else {

      setRangeEnd(date);

    }

  };



  const blockRange = () => {

    if (!rangeStart || !rangeEnd) return;


    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);


    const dates:string[] = [];


    while(start <= end) {

      dates.push(
        start.toISOString().split("T")[0]
      );

      start.setDate(
        start.getDate() + 1
      );

    }


    setBlockedDates([
      ...blockedDates,
      ...dates
    ]);

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
          Manage availability, prices, blocked dates and special offers.
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
            onClick={() => setYear(year - 1)}
          >
            ← Previous Year
          </button>


          <h2>
            {year}
          </h2>


          <button
            style={greenBtn}
            onClick={() => setYear(year + 1)}
          >
            Next Year →
          </button>


        </div>



        <div
          style={{
            marginTop:20,
            display:"flex",
            gap:15,
          }}
        >


          <button
            style={greenBtn}
            disabled={!rangeStart || !rangeEnd}
            onClick={blockRange}
          >
            🚫 Block Selected Dates
          </button>



          <button style={greenBtn}>
            💷 Change Prices
          </button>


          <button style={greenBtn}>
            🔥 Special Offers
          </button>


          <button style={greenBtn}>
            📅 Sync Calendar
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



              const isSelected =
              rangeStart === date;



              const isInRange =
              rangeStart &&
              rangeEnd &&
              date >= rangeStart &&
              date <= rangeEnd;



              return (

                <div

                  key={date}

                  onClick={() => handleDateClick(date)}

                  style={{

                    height:36,

                    border:"1px solid #ddd",

                    borderRadius:6,

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                    cursor:"pointer",


                    background:

                    isBlocked

                    ? "#dc2626"

                    : isInRange

                    ? "#fecaca"

                    : isSelected

                    ? "#14532d"

                    : "#f8faf8",


                    color:

                    isBlocked || isSelected

                    ? "white"

                    : "black",

                  }}

                >

                  {day+1}

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


        </div>

      )}






      <button
        onClick={() => navigate("/host-dashboard")}
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
