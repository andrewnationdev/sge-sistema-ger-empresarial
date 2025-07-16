import React from 'react';

interface IIcon {
    name: string;
    marginLeft?: string;
    marginRight?: string;
}

export default function Icon(props:IIcon){
    return (<i style={{
        marginLeft: props!.marginLeft ?? "0px",
        marginRight: props!.marginRight ?? "0px",
    }}    
    className={`bi bi-${props.name}`}/>);
}