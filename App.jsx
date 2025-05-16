import Face from "./Face";
import AttendanceComponent from "./AttendanceComponent";
import { useState } from "react";
function App() {  
  
      const [btn,setBtn] = useState(false);
      const [ctr,setCtr] = useState(0);
      const change=()=>{
        setCtr(ctr+1);
        if(ctr%2==0){
          setBtn(true);
        }
        else{
          setBtn(false);
        }
      }
  return(
 <>

<div className="ctr">
  
  <AttendanceComponent/> 
   
    <div>
      <button onClick={()=>{change()}}> Start session</button>
      {
        btn===true?<div><><Face/></></div>:null

      }

      
      </div>
   
</div>
  
  </>

);
}

export default App;
