import React from 'react';
import Card from './Card';

const ExtensionCard = ({ extension }) => {
  const ExtComponent = extension.component;

  return (
    <Card 
      title={extension.name}
      className="extension-card"
    >
      <div className="extension-meta">
        <span className="extension-version">v{extension.version}</span>
        <span className="extension-author">by {extension.author}</span>
      </div>
      <div className="extension-content">
        <ExtComponent />
      </div>
    </Card>
  );
};

export default ExtensionCard;