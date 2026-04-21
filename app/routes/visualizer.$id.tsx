import { useParams } from "react-router";

function VisualizerId() {
  const { id } = useParams();
  return <div>Visualizer {id}</div>;
}

export default VisualizerId;