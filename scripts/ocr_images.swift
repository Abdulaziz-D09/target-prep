import Foundation
import Vision
import AppKit

// OCR all math-bank images using macOS Vision framework
// Output: JSON dictionary { "question_id": "extracted_text", ... }

let args = CommandLine.arguments
guard args.count > 1 else {
    fputs("Usage: ocr_images <directory>\n", stderr)
    exit(1)
}

let dirPath = args[1]
let fileManager = FileManager.default

guard let files = try? fileManager.contentsOfDirectory(atPath: dirPath) else {
    fputs("Cannot read directory: \(dirPath)\n", stderr)
    exit(1)
}

let jpgFiles = files.filter { $0.hasSuffix(".jpg") }.sorted()
fputs("Processing \(jpgFiles.count) images...\n", stderr)

var results: [String: String] = [:]
let semaphore = DispatchSemaphore(value: 0)
var processed = 0

for filename in jpgFiles {
    let questionId = String(filename.dropLast(4)) // remove .jpg
    let filePath = (dirPath as NSString).appendingPathComponent(filename)
    
    guard let image = NSImage(contentsOfFile: filePath),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        fputs("  Skip (cannot load): \(filename)\n", stderr)
        continue
    }
    
    let request = VNRecognizeTextRequest { request, error in
        defer { semaphore.signal() }
        
        if let error = error {
            fputs("  Error for \(filename): \(error.localizedDescription)\n", stderr)
            return
        }
        
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        
        // Sort observations by Y position (top to bottom)
        let sorted = observations.sorted { $0.boundingBox.origin.y > $1.boundingBox.origin.y }
        
        var lines: [String] = []
        for obs in sorted {
            if let candidate = obs.topCandidates(1).first {
                lines.append(candidate.string)
            }
        }
        
        results[questionId] = lines.joined(separator: "\n")
    }
    
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["en-US"]
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
        semaphore.wait()
    } catch {
        fputs("  Failed to perform OCR on \(filename): \(error.localizedDescription)\n", stderr)
    }
    
    processed += 1
    if processed % 50 == 0 {
        fputs("  Processed \(processed)/\(jpgFiles.count)\n", stderr)
    }
}

fputs("Done. Processed \(processed) images, got text for \(results.count)\n", stderr)

// Output as JSON
if let jsonData = try? JSONSerialization.data(withJSONObject: results, options: [.prettyPrinted, .sortedKeys]),
   let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
} else {
    fputs("Failed to serialize JSON\n", stderr)
    exit(1)
}
