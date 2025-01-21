declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  namespace jspdf {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
  }

  export default jspdf;
}
