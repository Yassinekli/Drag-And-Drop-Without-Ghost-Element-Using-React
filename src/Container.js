import React, { Component } from 'react'
import Item from './Item'

class Container extends Component {
	constructor(){
		super();
		this.state = {
			draggedId: null,
			boxes : [
				{id : '0', color : '#dede30'},
				{id : '1', color : '#d82b2b'},
				{id : '2', color : '#3434da'},
				{id : '3', color : '#2bb130'},
				{id : '4', color : '#7d34da'}
			]
		}
	}

	dragStartHandler = (e)=>{
		let boxes = this.state.boxes.slice();

		let draggedStyle = window.getComputedStyle(e.target);
		let draggedRec = e.target.getBoundingClientRect();
		let parentRec = e.target.parentNode.getBoundingClientRect();

		let color = draggedStyle.backgroundColor;
		let top = (draggedRec.top - parentRec.top) + "px";

		boxes.push(
			{
				id : e.target.getAttribute('id') + 'c', 
				color,
				top
			}
		)

		this.setState({
			draggedId: e.target.getAttribute('id'),
			boxes
		});
	}

	dragEnterHandler = (e)=>{
		let hoveredId = e.target.getAttribute('id');
		
		if(hoveredId === this.state.draggedId || hoveredId.endsWith('c'))
			return;

		let hoveredRec = e.target.getBoundingClientRect();
		let parentRec = e.target.parentNode.getBoundingClientRect();
		let indexDraggedElement = this.state.boxes.findIndex((box)=>(box.id === this.state.draggedId));
		let indexHoveredElement = this.state.boxes.findIndex((box)=>(box.id === hoveredId));
		
		let draggedBoxes;

		if(indexDraggedElement > indexHoveredElement)
			draggedBoxes = this.state.boxes.slice(indexHoveredElement, indexDraggedElement);
		else
			draggedBoxes = this.state.boxes.slice((indexDraggedElement + 1), (indexHoveredElement + 1));

		let filteredBoxes = [];
		for (let i = 0; i < this.state.boxes.length; i++) {
			let breaked = false;
			for (let j = 0; j < draggedBoxes.length; j++) {
				if(this.state.boxes[i].id === draggedBoxes[j].id)
					{ breaked = true; break; }
			}
			if(!breaked)
				filteredBoxes.push(this.state.boxes[i]);
		}
		
		if(indexDraggedElement > indexHoveredElement)
			draggedBoxes.forEach(box => {
				filteredBoxes.splice(++indexHoveredElement, 0, box)
			});
		else
			draggedBoxes.forEach(box => {
				filteredBoxes.splice(indexDraggedElement++, 0, box)
			});
		
		filteredBoxes[filteredBoxes.length - 1].top = ((hoveredRec.top - parentRec.top) + "px");

		this.setState({
			draggedId: this.state.draggedId,
			boxes : filteredBoxes
		});
	}

	dragEndHandler = (e)=>{
		let boxes = this.state.boxes.slice();
		boxes.pop();

		this.setState({
			draggedId: null,
			boxes
		});
	}
	

	render() {
		let boxes = this.state.boxes
			.map(box =>
			<Item
				key={box.id}
				id={box.id}
				style={{color:box.color, top:box.top}}
				draggedId={this.state.draggedId}

				dragStartHandler={this.dragStartHandler}
				dragEnterHandler={this.dragEnterHandler}
				dragEndHandler={this.dragEndHandler}
			/>);

		return (
			<div className="container">
				{boxes}
			</div>
		)
	}
}

export default Container;
