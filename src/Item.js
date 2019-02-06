import './style.css';
import React, { Component } from 'react';;

class Item extends Component {
	constructor(props){
		super(props);
		this.state = {
			elementId : props.id
		};
	}

	/* 
		Methods
	*/
	getClassNames(draggedId){
		let classNames = 'item';
		if(this.state.elementId === draggedId)
			return classNames.concat(' hide');
		return classNames;
	}

	getStyle(){
		if(this.props.style.top)
			return { 
				background: this.props.style.color, 
				top:  this.props.style.top, 
				position: 'absolute', 
				zIndex:'-1'
			};
		return { background: this.props.style.color }
	}

	render() {
		return (
			<div
				id={this.props.id}
				className={this.getClassNames(this.props.draggedId)}
				style={this.getStyle()}
			
				draggable
				onDragStart={(e)=>this.props.dragStartHandler(e)}
				onDragEnter={(e)=>this.props.dragEnterHandler(e)}
				onDragOver={(e)=>e.preventDefault()}
				onDragEnd={(e)=>this.props.dragEndHandler(e)}
			>
			</div>
		)
	}
}

export default Item;
