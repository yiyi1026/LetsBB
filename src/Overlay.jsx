import FullScreen from "./FullScreen"
import styled from "styled-components"

export default styled(FullScreen)`
  background: ${(props) => props.background};
  opacity: ${(props) => props.opacity};
`
