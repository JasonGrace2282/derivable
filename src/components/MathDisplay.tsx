import { FC } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathDisplayProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathDisplay: FC<MathDisplayProps> = ({ math, block = false, className }) => {
  const containsMixedContent = (content: string): boolean => {
    return content.includes(' ') && !content.startsWith('\\$') && !content.startsWith('\\(') && !content.startsWith('\\begin');
  };
  
  const processMixedContent = (content: string): JSX.Element[] => {
    const formattedContent = formatMathExpressions(content);
    const parts = formattedContent.split(/(\\?\$.*?\\?\$|\\\(.*?\\\))/g);
    
    return parts.map((part, index) => {
      if (!part.trim()) return null;
      
      const isMath = part.startsWith('\\$') && part.endsWith('\\$') || 
                      part.startsWith('\\(') && part.endsWith('\\)');
      
      if (isMath) {
        const mathContent = part.replace(/^\$|\$|\\\(|\\\)/g, '');
        return <InlineMath key={index} math={mathContent} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    }).filter(Boolean);
  };

  const formatMathExpressions = (content: string): string => {
    let formatted = content;
    
    formatted = formatted.replace(
      /([a-z])\^([a-z])\s*\+\s*([a-z])\^([a-z])\s*=\s*([a-z])\^([a-z])/gi,
      "$$1^{$2} + $3^{$4} = $5^{$6}$"
    );
    
    formatted = formatted.replace(
      /([a-z])\^([a-z0-9])/gi,
      "$$1^{$2}$"
    );

    formatted = formatted.replace(
      /([a-z0-9])\s*(>|<)\s*([a-z0-9])/gi,
      "$$1 $2 $3$"
    );

    return formatted;
  };

  const cleanedMath = math.trim();
  
  if (containsMixedContent(cleanedMath)) {
    return (
      <div className={`math-content ${className || ''}`}>
        {processMixedContent(cleanedMath)}
      </div>
    );
  }
  
  if (block) {
    return <BlockMath math={cleanedMath} className={className} />;
  }
  
  return <InlineMath math={cleanedMath} className={className} />;
};
