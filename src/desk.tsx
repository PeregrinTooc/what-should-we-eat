import { DishPlan } from "./dishPlan/dishPlan.tsx";
import { RecipeBook } from "./dishes/recipeBook.tsx";
import { Button, Columns, Container, Heading } from "react-bulma-components";
import html2canvas from "html2canvas";
import { useRef } from "react";
function createDesk(dishPlan: DishPlan, recipeBook: RecipeBook) {
  return {
    render: () => {
      return <Desk dishPlan={dishPlan} recipeBook={recipeBook} />;
    },
  };
}

function Desk({ dishPlan, recipeBook }) {
  const saveAsImage = async (element) => {
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };
  const printRef = useRef();
  const handleDownloadImage = async () => {
    await saveAsImage(printRef.current);
  };
  return (
    <Container>
      <Heading textAlign="center">Was wollen wir essen?</Heading>
      <Columns centered={true}>
        <Columns.Column>
          <div ref={printRef}>{dishPlan.render()}</div>
          <div className="pt-4">
            <Button onClick={handleDownloadImage}>Als Bild Speichern</Button>
          </div>
        </Columns.Column>
        <Columns.Column>{recipeBook.render()}</Columns.Column>
      </Columns>
    </Container>
  );
}

export default createDesk;
