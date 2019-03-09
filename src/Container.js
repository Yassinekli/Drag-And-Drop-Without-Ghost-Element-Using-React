import React, { Component } from 'react';
import Item from './Item';

class Container extends Component {
	constructor(){
		super();
		this.state = {
			draggedId: null,
			lastHoveredId : null,
			boxes : [
				{id : '0', color : '#dede30', order: 1},
				{id : '1', color : '#d82b2b', order: 2},
				{id : '2', color : '#3434da', order: 3},
				{id : '3', color : '#2bb130', order: 4},
				{id : '4', color : '#7d34da', order: 5}
			]
		}
	}
	
	/*
		Methods
	*/
	getBoxes(){
		//console.log(this.state.boxes)
		return this.state.boxes.map(({id, color, order}) =>
				<Item
					key={id}
					id={id}
					style={{color:color, top : (100 * (order - 1))}}
					lastHoveredId={this.state.lastHoveredId}
					
					draggedId={this.state.draggedId}
					dragStartHandler={this.dragStartHandler}
					dragEnterHandler={this.dragEnterHandler}
					dragEndHandler={this.dragEndHandler}
				/>
			);
	}

	/*
		Handlers
	*/
	dragStartHandler = (e)=>{
		let boxes = this.state.boxes.slice();
		let draggedBox = this.state.boxes.find(box=>(box.id === e.target.getAttribute('id')));

		let color = draggedBox.color;
		let order = draggedBox.order;
		
		boxes.push(
			{
				id : e.target.getAttribute('id') + 'c', 
				color,
				order
			}
		)

		this.setState({
			draggedId: e.target.getAttribute('id'),
			lastHoveredId : null,
			boxes
		});
	}

	dragEnterHandler = (e)=>{
		let hoveredId = e.currentTarget.getAttribute('id');
		
		if(hoveredId.endsWith('c') || hoveredId === this.state.draggedId )
			return;

		if(hoveredId === this.state.lastHoveredId)
		{
			let top = window.getComputedStyle(e.currentTarget).top;
			top = top.substring(0, top.length - 2);
			if(top != ((this.state.lastOrderHovered - 1) * 100))
				return;
		}
		
		let orderDraggedElement = this.state.boxes.find((box)=>(box.id === this.state.draggedId)).order;
		let orderHoveredElement = this.state.boxes.find((box)=>(box.id === hoveredId)).order;
		
		let boxes = this.state.boxes.slice();
		let draggedBoxes = [];
		let draggedIndex;
		let hoveredIndex;

		if(orderDraggedElement > orderHoveredElement)
		{
			this.state.boxes.forEach((box, i)=>{
				if(box.id.endsWith('c'))
					return
				if(box.order === orderDraggedElement)
					draggedIndex = i;
				if(box.order === orderHoveredElement)
					hoveredIndex = i;
				if(box.order >= orderHoveredElement && box.order < orderDraggedElement)
					draggedBoxes.push(box);
			})
			
			boxes[draggedIndex].order = boxes[hoveredIndex].order;
			draggedBoxes.forEach(box=>++box.order);
		}
		else
		{
			this.state.boxes.forEach((box, i)=>{
				if(box.id.endsWith('c'))
					return
				if(box.order === orderDraggedElement)
					draggedIndex = i;
				if(box.order === orderHoveredElement)
					hoveredIndex = i;
				if(box.order > orderDraggedElement && box.order <= orderHoveredElement)
					draggedBoxes.push(box);
			})
			
			boxes[draggedIndex].order = boxes[hoveredIndex].order;
			draggedBoxes.forEach(box=>--box.order);
		}

		boxes[boxes.length - 1].order = boxes[draggedIndex].order;

		this.setState({
			draggedId: this.state.draggedId,
			lastHoveredId : hoveredId,
			lastOrderHovered: boxes[hoveredIndex].order,
			boxes
		});
	}

	dragEndHandler = (e)=>{
		let boxes = this.state.boxes.slice();
		boxes.pop();

		this.setState({
			draggedId: null,
			lastHoveredId : null,
			boxes
		});
	}
	

	render() {
		let boxes = this.getBoxes();

		return (
			<div 
				className="container"
				style={{height: (this.state.draggedId) ? ((boxes.length - 1) * 100) : (boxes.length * 100)}}
			>
				{boxes}
			</div>
		)
	}
}

export default Container;