
import React from 'react';


export class BasicEvent extends React.Component {
  render() {
    let { title: string } = this.props;
    return <div>
      <h3>{title}</h3>

    </div>;
  }
}
