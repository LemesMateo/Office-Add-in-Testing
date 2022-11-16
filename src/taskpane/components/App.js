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
      documentType: null,
      formConfig: null
    };
    this.setDocumentType = this.setDocumentType.bind(this)
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

    var data = {
      "FileName": attachment.name,
      "FIle": result.value.content,
      "Document_Type": this.state.documentType.id,
      "Container_Type": this.state.container.typeId,
      "Container_Code": this.state.container.containerCode,
      "Company_Branch_Code": this.state.container.branchCode,
      "DocumentPropertyValues": [
        {
          "Name": "d_Title",
          "Value": attachment.name
        }
      ]
    };
    
    var dataForm = JSON.parse(e);

    Object.keys(dataForm).forEach(key => {
      console.log(key, dataForm[key]);
      if (key === "d_Title")
      {
        data.DocumentPropertyValues.find(x=> x.Name === "d_Title").Value == dataForm[key];
      }
      else
      {
        data.DocumentPropertyValues.push(
          {
            "Name": key,
            "Value": dataForm[key]
          }
        );
      }
    });
    console.log("data:", data);     
     
     
    var raw = JSON.stringify(data);
    
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
    this.setState({
      documentType : paramDocumentType
    });
    if (paramDocumentType && paramDocumentType.id)
    {
      console.log("if paramDocumentType:" ,paramDocumentType);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(`https://cdnet-demo-api.azurewebsites.net/api/dev?name=GetConfigurationDocumentsTypeProperties&method=get&documentTypeId=${paramDocumentType.id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log("Getconfig:",result);
          console.log("container desde dentro del Fetch:",this.state.container);
          this.setState({
            formConfig: JSON.parse(result).data
          });
      })
        .catch(error => console.log('error', error));    
      
  
    } 
    else
    {
      console.log("else paramDocumentType:" ,paramDocumentType);
    }
    
    
  }



  setContainer = (paramContainer) => {
    // this.state.container = paramContainer;
    this.setState({
      container : paramContainer
    });
    
  }


  render() {
    
    const { title, isOfficeInitialized } = this.props;

    
    
    
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
            setSelected={this.setContainer}
            displayName="name" 
            keyName="id" 
            fetchUrl="https://cdnet-demo-api.azurewebsites.net/api/dev?name=Containerslist&method=get" 
          />

          

          {
            this.state.container  &&
            <AutoComplete
            label={label2}
            setSelected={this.setDocumentType}
            displayName="name"
            keyName="id"
            fetchUrl={`https://cdnet-demo-api.azurewebsites.net/api/dev?name=GetContainer/${this.state.container.id}&method=get&id=${this.state.container.id}`}
          /> 

          }

          {
            this.state.documentType && this.state.formConfig &&
            <Formulario submit={this.click} config={this.state.formConfig} />
          }
          
          
        </div>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
