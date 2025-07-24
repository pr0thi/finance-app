import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import Tesseract from 'tesseract.js';

type ReceiptData = {
  date: Date | null;
  payee: string;
  amount: string;
};

type ImageUploaderProps = {
  setValue: UseFormSetValue<any>;
  disabled?: boolean;
};

export const ImageUploader = ({ setValue, disabled }: ImageUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const extractReceiptData = async (text: string): Promise<ReceiptData> => {
    console.log("Extracted text:", text);
    
    const result: ReceiptData = {
      date: null,
      payee: "",
      amount: "",
    };
    
    try {
      // Extract date - look for common date formats
      const dateRegex = /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})|(\d{2,4}[\/\.-]\d{1,2}[\/\.-]\d{1,2})/g;
      const dateMatch = text.match(dateRegex);
      
      if (dateMatch && dateMatch[0]) {
        // Try to parse the date
        try {
          const parsedDate = new Date(dateMatch[0]);
          if (!isNaN(parsedDate.getTime())) {
            result.date = parsedDate;
          }
        } catch (error) {
          console.error("Failed to parse date:", error);
        }
      }
      
      // Extract amount/total - look for common patterns
      const amountRegex = /(total|amount|subtotal|sub-total|sum)[\s:$]*([\d,.]+)/i;
      const amountMatch = text.match(amountRegex);
      
      if (amountMatch && amountMatch[2]) {
        // Clean up the amount string (remove commas, ensure decimal format)
        const cleanAmount = amountMatch[2].replace(/,/g, '');
        result.amount = cleanAmount;
      }
      
      // Extract payee (usually at the top of the receipt)
      // This is the most challenging part as there's no standard format
      // A simple approach is to take the first line or two
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 0) {
        // Take the first non-empty line that's not a date or amount
        for (const line of lines.slice(0, 3)) {
          if (
            !line.match(dateRegex) && 
            !line.match(/total|amount|subtotal|sub-total|sum/i) &&
            line.length > 3
          ) {
            result.payee = line.trim();
            break;
          }
        }
      }
      
      console.log("Extracted data:", result);
      return result;
    } catch (error) {
      console.error("Error extracting receipt data:", error);
      return result;
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    
    try {
      console.log("Processing image...");
      
      // Use Tesseract.js to extract text from the image
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      
      // Extract structured data from the text
      const receiptData = await extractReceiptData(text);
      
      // Update form fields with the extracted data
      if (receiptData.date) {
        setValue('date', receiptData.date);
        console.log("Set date:", receiptData.date);
      }
      
      if (receiptData.payee) {
        setValue('payee', receiptData.payee);
        console.log("Set payee:", receiptData.payee);
      }
      
      if (receiptData.amount) {
        setValue('amount', receiptData.amount);
        console.log("Set amount:", receiptData.amount);
      }
      
    } catch (error) {
      console.error("Failed to process image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        id="receipt-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={disabled || isProcessing}
      />
      <label htmlFor="receipt-upload">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={disabled || isProcessing}
          asChild
        >
          <span>
            <Camera className="size-4 mr-2" />
            {isProcessing ? "Processing receipt..." : "Scan receipt"}
          </span>
        </Button>
      </label>
    </div>
  );
};