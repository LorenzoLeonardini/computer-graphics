import { Vector2 } from './Vector'

export enum MouseButton {
	LEFT,
	MIDDLE,
	RIGHT
}

export class InputHandler {
	public canvasWidth: number = 500
	public canvasHeight: number = 500

	private keyStatus: { [keyCode: string]: boolean } = {}
	private mouseButtonStatus: { [key in MouseButton]: boolean } = {
		0: false,
		1: false,
		2: false
	}

	private mousePosition = {
		last: {
			x: 0,
			y: 0
		},
		current: {
			x: 0,
			y: 0
		}
	}

	private mouseWheel = {
		deltaX: 0,
		deltaY: 0
	}

	onKeyDownHandler = (event: KeyboardEvent) => {
		this.keyStatus[event.code] = true
	}

	onKeyUpHandler = (event: KeyboardEvent) => {
		this.keyStatus[event.code] = false
	}

	public isKeyPressed(keyCode: string): boolean {
		return keyCode in this.keyStatus && this.keyStatus[keyCode]
	}

	onContextMenuHandler = () => {}

	onMouseDownHandler = (event: MouseEvent) => {
		if (event.button === 0) {
			this.mouseButtonStatus[MouseButton.LEFT] = true
		} else if (event.button === 1) {
			this.mouseButtonStatus[MouseButton.MIDDLE] = true
		} else if (event.button === 2) {
			this.mouseButtonStatus[MouseButton.RIGHT] = true
		}
		event.preventDefault()
	}

	onMouseUpHandler = (event: MouseEvent) => {
		if (event.button === 0) {
			this.mouseButtonStatus[MouseButton.LEFT] = false
		} else if (event.button === 1) {
			this.mouseButtonStatus[MouseButton.MIDDLE] = false
		} else if (event.button === 2) {
			this.mouseButtonStatus[MouseButton.RIGHT] = false
		}
		event.preventDefault()
	}

	public isMouseButtonClicked(btn: MouseButton): boolean {
		return this.mouseButtonStatus[btn]
	}

	public getMousePosition(): Vector2 {
		return new Vector2(this.mousePosition.current.x, this.mousePosition.current.y)
	}

	public getMousePositionDelta(): Vector2 {
		return new Vector2(
			this.mousePosition.current.x - this.mousePosition.last.x,
			this.mousePosition.current.y - this.mousePosition.last.y
		)
	}

	onMouseMoveHandler = (event: MouseEvent) => {
		this.mousePosition.current.x = event.clientX
		this.mousePosition.current.y = event.clientY
	}

	onWheelHandler = (event: WheelEvent) => {
		this.mouseWheel.deltaX = event.deltaX
		this.mouseWheel.deltaY = event.deltaY
	}

	public mouseWheelY(): number {
		return this.mouseWheel.deltaY
	}

	public mouseWheelX(): number {
		return this.mouseWheel.deltaX
	}

	public registerAllHandlers(): void {
		document.body.onkeydown = this.onKeyDownHandler
		document.body.onkeyup = this.onKeyUpHandler

		document.body.oncontextmenu = this.onContextMenuHandler

		document.body.onmousedown = this.onMouseDownHandler
		document.body.onmouseup = this.onMouseUpHandler
		document.body.onmousemove = this.onMouseMoveHandler
		document.body.onwheel = this.onWheelHandler
	}

	public reset(): void {
		this.mouseWheel.deltaX = 0
		this.mouseWheel.deltaY = 0

		this.mousePosition.last.x = this.mousePosition.current.x
		this.mousePosition.last.y = this.mousePosition.current.y
	}
}
