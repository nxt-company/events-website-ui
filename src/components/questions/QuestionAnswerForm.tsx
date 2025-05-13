
import { useState } from "react";
import { Question, Answer } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface QuestionAnswerFormProps {
  questions: Question[];
  onSubmit: (answers: Answer[]) => Promise<void>;
  isSubmitting: boolean;
  existingAnswers?: Answer[];
}

export function QuestionAnswerForm({ 
  questions, 
  onSubmit, 
  isSubmitting, 
  existingAnswers 
}: QuestionAnswerFormProps) {
  // Initialize answers from existingAnswers or empty array
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (existingAnswers) {
      return existingAnswers.reduce(
        (acc, answer) => ({
          ...acc,
          [answer.question_id]: answer.selected_option,
        }),
        {}
      );
    }
    return {};
  });

  const handleOptionChange = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    
    const formattedAnswers: Answer[] = Object.entries(answers).map(
      ([questionId, optionIndex]) => ({
        question_id: questionId,
        selected_option: optionIndex,
      })
    );
    
    await onSubmit(formattedAnswers);
  };

  const isReadOnly = !!existingAnswers;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question, index) => (
        <Card key={question.id} className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">
              {index + 1}. {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleOptionChange(question.id, parseInt(value))}
              disabled={isReadOnly || isSubmitting}
            >
              <div className="space-y-3">
                {question.options.map((option, i) => (
                  <div key={i} className="flex items-center">
                    <RadioGroupItem
                      value={i.toString()}
                      id={`q-${question.id}-opt-${i}`}
                      disabled={isReadOnly || isSubmitting}
                    />
                    <Label 
                      htmlFor={`q-${question.id}-opt-${i}`}
                      className="ml-2 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {!isReadOnly && (
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || Object.keys(answers).length !== questions.length}
        >
          {isSubmitting ? "Submitting Answers..." : "Submit Answers"}
        </Button>
      )}
    </form>
  );
}
