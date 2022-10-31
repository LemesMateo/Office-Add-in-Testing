import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";
import { Formulario } from "./Formulario";
import { Myselect } from "./MySelect";

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

  /* componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Conseguí más con Integración de Office",
        },
        {
          icon: "Unlock",
          primaryText: "Desbloquea funciones y funcionalidad",
        },
        {
          icon: "Design",
          primaryText: "Crea y visualiza como un pro",
        },
      ],
    });
  }; */



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
    console.log("Objeto de click:", e);
    console.log("Office:", Office);
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

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Carpeta digital" />
        {/* <Myselect/> */}
        <HeroList message="Contenedor y tipo de documento" items={this.state.listItems}>
          <p className="ms-font-l">
            Acá iría el <b>Formulario Dinamico</b>.
          </p>
          <Formulario/>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
            Run
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
