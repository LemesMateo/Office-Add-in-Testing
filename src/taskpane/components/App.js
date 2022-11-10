import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import Progress from "./Progress";
import { Formulario } from "./Formulario";
import { autoCompleteData } from "./data.js";
import { autoCompleteData2 } from "./data2.js";
import AutoComplete from "./Autocomplete";
import AutoComplete2 from "./AutoComplete2";
import { useFetch } from "../hooks/useFetch";


//const baseURL = "http://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/PostDocuments";
const baseURL = "https://cdnet-demo-api.azurewebsites.net/api/dev?name=PostDocuments";

/* global require */



export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  attachmentTokenCallback = (asyncResult, userContext) => {
    if (asyncResult.status === "succeeded") {
        // Cache the result from the server.
        console.log("asyncResult:", asyncResult.value)
        serviceRequest.attachmentToken = asyncResult.value;
        serviceRequest.state = 3;
        // testAttachments(); 
    } else {
        showToast("Error", "Could not get callback token: " + asyncResult.error.message);
    }
  };


  
  click = async (e) => {
    console.log("Office:", Office);
    console.log("Recibido del submit de formulario:", e)
    let serviceRequest = {
      attachmentToken: '',
      ewsUrl         : Office.context.mailbox.ewsUrl,
      attachments    : []
   };
   let attachment = Office.context.mailbox.item.attachments[0];
   console.log("attachment: ", attachment);
   Office.context.mailbox.item.getAttachmentContentAsync(attachment.id, (result)=> {
   
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    
    
    var raw = JSON.stringify({
      "FileName": attachment.name,
      "FIle": result.value.content,
      "Document_Type": 274,
      "Container_Type": 14,
      "Container_Code": "CAL-01",
      "Company_Branch_Code": "1233",
      "DocumentPropertyValues": [
        {
          "Name": "d_Titlee",
          "Value": attachment.name
        }
      ]
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://cdnet-demo-api.azurewebsites.net/api/dev?name=PostDocuments", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));    
   });

    if (serviceRequest.attachmentToken == "") {
      Office.context.mailbox.getCallbackTokenAsync(attachmentTokenCallback);
  }
  };
  

  render() {
    const { title, isOfficeInitialized } = this.props;



    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    // es posible que todo lo de aca abajo, tenga que ir arriba del render()
    // const [containerList, setContainerList] = React.useState([]);
    // const [containerSelect, setContainerSelect] = React.useState({});


    // const [docTypeList, setDocTypeList] = React.useState([]);
    // const [docTypeSelect, setDocTypeSelect] = React.useState({});

    // const dataContainers = (query) => {
    //   var requestOptions = {
    //     method: 'GET',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //   };
      
    //   fetch(`cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/ContainersList?query=${query}`, requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .then(result => setContainerList(result.data))
    //     .catch(error => console.log('error', error));
    // }
    // const dataDocType = (query) => {
    //   var requestOptions = {
    //     method: 'GET',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //   };
    //   fetch(`cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/GetContainer/20?query=${query}`, requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .then(result => setDocTypeList(result.data))
    //     .catch(error => console.log('error', error));
    // }



    const label1 = "Container";
    const label2 = "Document Type";

    const [docTypeData, setDocTypeData] = React.useState({});

    const fetch2 = `https://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/GetContainer/20?query=`
    // const fetchDocType = () => {
    //   const { data, error, loading } = useFetch(`https://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/GetContainer/20?query=`, query);
    // }

    return (
      <div className="ms-welcome">
        <div className="ms-welcome__main">
          {/* <AutoComplete data={containerList} label={label1} setSelection={setContainerSelect} fetchFn={dataContainers} />
          <AutoComplete data={docTypeList} label={label2} setSelection={setDocTypeSelect} fetchFn={dataDocType} /> */}
          <AutoComplete2 label={label2} fetchDir={fetch2} dataSet={setDocTypeData} />
          <Formulario submit={this.click} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
