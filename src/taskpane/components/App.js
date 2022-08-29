import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";


/* global require */



export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
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
    console.log("Objeto de click:", e);
    console.log("Office:", Office);
    let serviceRequest = {
      attachmentToken: '',
      ewsUrl         : Office.context.mailbox.ewsUrl,
      attachments    : []
   };
   let attachment = Office.context.mailbox.item.attachments[0];
   Office.context.mailbox.item.getAttachmentContentAsync(attachment.id, console.log);
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
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Benvenutto" />
        <HeroList message="Descubre lo que puedes hacer con nuestro AddIn inutil!" items={this.state.listItems}>
          <p className="ms-font-l">
            Modifica algo que no se que es, y luego apreta <b>Run</b>.
          </p>
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
