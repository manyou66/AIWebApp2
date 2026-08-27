"use client";
export function DetectionPanel() {
    return (
        <section>
            <h2>
                Object Detection
            </h2>
            <br></br>
            <button
                onClick={() =>
                    alert(
                        "Prepare object detection"
                    )
                }
            >
                Prepare Detection
            </button>
        </section>
    );
}
