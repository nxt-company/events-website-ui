
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import { AddQuestionRequest } from "@/types/api";

interface QuestionFormProps {
  onSubmit: (data: AddQuestionRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionForm({ onSubmit, isSubmitting }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("Questions require at least two options");
      return;
    }

    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Adjust correct answer if needed
    if (correctAnswer === index) {
      setCorrectAnswer(0);
    } else if (correctAnswer > index) {
      setCorrectAnswer(correctAnswer - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!questionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (options.some((option) => !option.trim())) {
      toast.error("All options must have content");
      return;
    }

    await onSubmit({
      text: questionText,
      options,
      correct_answer: correctAnswer,
    });

    // Reset form
    setQuestionText("");
    setOptions(["", ""]);
    setCorrectAnswer(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Question</CardTitle>
        <CardDescription>
          Create a new multiple choice question
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="question-text">Question</Label>
            <Input
              id="question-text"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddOption}
                disabled={isSubmitting || options.length >= 6}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant={correctAnswer === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCorrectAnswer(index)}
                  disabled={isSubmitting}
                >
                  {correctAnswer === index ? "Correct" : "Mark Correct"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                  disabled={isSubmitting || options.length <= 2}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Question..." : "Add Question"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
