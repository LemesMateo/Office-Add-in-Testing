import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import Progress from "./Progress";
import { Formulario } from "./Formulario";
import AutoComplete from "./Autocomplete";



//const baseURL = "http://cd-net-demo2.eastus2.cloudapp.azure.com/api/v1.0/PostDocuments";
// const baseURL = "https://cdnet-demo-api.azurewebsites.net/api/dev?name=PostDocuments";

/* global require */



export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      container: undefined,
      documentType: null
    };
  };
  


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
  
  
  
  
  setDocumentType = (paramDocumentType) => {
    this.state.documentType = paramDocumentType;
    console.log("setDocumentType desde App.js", this.state.documentType);
  }
  
  render() {
    
    const { title, isOfficeInitialized } = this.props;

    setContainer = (paramContainer) => {
      // this.state.container = paramContainer;
      this.setState(st => {
        st.container = paramContainer
      });
      console.log("setContainer desde App.js", this.state.container);
    }

    
    
    // const [selectedContainer, setSelectedContainer] = React.useState();
    // const [documentType, setDocumentType] = React.useState();

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    const label1 = "Container";
    const label2 = "Document Type";
    const fetch1 = `https://cdnet-demo-api.azurewebsites.net/api/dev?name=Containerslist&method=get`; //Este funciona.
    const fetch2 = `https://cdnet-demo-api.azurewebsites.net/api/dev?name=GetContainer/20&method=get&id=20`; // Funciona
    return (
      <div className="ms-welcome">
        <div className="ms-welcome__main">
          <AutoComplete 
            label={label1} 
            setSelected={setContainer}
            displayName="name" 
            keyName="id" 
            fetchUrl="https://cdnet-demo-api.azurewebsites.net/api/dev?name=Containerslist&method=get" 
          />

          
          <p>
            Resultado:
          { this.state.container == undefined ? "undefined" : "defined"}
          </p>


          {
            this.state.container != undefined &&
            <AutoComplete
              label={label2}
              setSelected={this.setDocumentType}
              displayName="name"
              keyName="id"
              fetchUrl={`https://cdnet-demo-api.azurewebsites.net/api/dev?name=GetContainer/${this.state.container.id}&method=get&id=${this.state.container.id}`}
            />
          }

          
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
